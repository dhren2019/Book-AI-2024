import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
// @ts-ignore
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Declaración global para extender 'window' y añadir 'flipbook'
declare global {
  interface Window {
    flipbook: {
      flipToPage: (pageNumber: number) => void;
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { storyId } = await req.json();

    // Validar que storyId no sea undefined o vacío
    if (!storyId) {
      return new NextResponse('Invalid story ID', { status: 400 });
    }

    // Generar la URL de la historia específica
    const storyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view-story/${storyId}`;
    if (!storyUrl) {
      throw new Error('URL is not defined properly');
    }

    // Inicializa Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Navegar a la URL del flipbook
    await page.goto(storyUrl, { waitUntil: 'networkidle0' });

    // Ocultar elementos no deseados para la captura
    await page.evaluate(() => {
      const unwantedElements = document.querySelectorAll('.menu, .sidebar, .controls, .icons, .arrows');
      unwantedElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    });

    // Obtener el número de páginas del flipbook
    const totalPages = await page.evaluate(() => {
      return document.querySelectorAll('.flipbook-page').length;
    });

    // Crear un array para almacenar las capturas de las páginas
    const pdfPages = [];

    // Capturar cada página del flipbook
    for (let i = 0; i < totalPages; i++) {
      // Navegar a la página actual del flipbook
      await page.evaluate((currentPage) => {
        if (window.flipbook && typeof window.flipbook.flipToPage === 'function') {
          window.flipbook.flipToPage(currentPage);
        }
      }, i);

      // Esperar un momento para asegurar que la página esté completamente renderizada
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capturar la página como imagen
      const screenshot = await page.screenshot({ fullPage: false });
      pdfPages.push(screenshot);
    }

    // Generar el PDF a partir de las imágenes capturadas
    const doc = new PDFDocument({
      size: 'A4',
      autoFirstPage: false, // No crear la primera página automáticamente
    });

    // Usar una fuente estándar sin problemas de archivo externo
    doc.font('Courier'); // Usar Courier, que es una fuente estándar segura

    let pdfBuffer = Buffer.alloc(0);
    const buffers: Buffer[] = [];

    // Agregar las páginas capturadas al PDF
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      pdfBuffer = Buffer.concat(buffers);
    });

    pdfPages.forEach((image, index) => {
      doc.addPage(); // Añadir una nueva página para cada captura
      doc.image(image, 0, 0, { width: 595.28, height: 841.89 }); // Tamaño A4 en puntos
    });

    // Finalizar el documento PDF
    doc.end();

    // Esperar a que se complete la generación del PDF antes de continuar
    await new Promise((resolve) => {
      doc.on('finish', resolve);
    });

    // Cerrar el navegador
    await browser.close();

    // Enviar el PDF como respuesta al cliente
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=story.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
