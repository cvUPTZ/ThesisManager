import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  Footer,
  Header,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  convertInchesToTwip,
  LevelFormat,
  LineRuleType,
  PageBreak,
  TableOfContents,
  Packer
} from 'docx';
import { saveAs } from 'file-saver';
import { Chapter, Section, ThesisMetadata, Reference } from '../types/thesis';

interface ExportOptions {
  metadata: ThesisMetadata;
  chapters: Chapter[];
  references: Reference[];
}

const STYLES = {
  heading1: {
    size: 32,
    bold: true,
    color: '000000'
  },
  heading2: {
    size: 28,
    bold: true,
    color: '000000'
  },
  normal: {
    size: 24,
    color: '000000'
  }
};

function createTitlePage(metadata: ThesisMetadata): Paragraph[] {
  return [
    new Paragraph({
      text: metadata.title || 'Untitled Thesis',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: convertInchesToTwip(2),
        after: convertInchesToTwip(1)
      }
    }),
    new Paragraph({
      text: 'A thesis submitted to',
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    }),
    new Paragraph({
      text: metadata.university || '[University Name]',
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(0.5) }
    }),
    new Paragraph({
      text: `in partial fulfillment of the requirements for the degree of\n${metadata.field || '[Field of Study]'}`,
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    }),
    new Paragraph({
      text: `Supervised by:\n${metadata.supervisor || '[Supervisor Name]'}`,
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    }),
    new Paragraph({
      text: new Date().getFullYear().toString(),
      alignment: AlignmentType.CENTER,
      spacing: { before: convertInchesToTwip(1) }
    })
  ];
}

function createTableOfContents(): Paragraph[] {
  return [
    new Paragraph({
      text: 'Table of Contents',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      spacing: { after: convertInchesToTwip(0.5) }
    }),
    new TableOfContents('Table of Contents', {
      hyperlink: true,
      headingStyleRange: '1-5'
    })
  ];
}

function createAbstract(metadata: ThesisMetadata): Paragraph[] {
  if (!metadata.abstract) return [];
  
  return [
    new Paragraph({
      text: 'Abstract',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    }),
    new Paragraph({
      text: metadata.abstract,
      spacing: { before: convertInchesToTwip(0.5) }
    }),
    new Paragraph({
      text: 'Keywords: ' + (metadata.keywords?.join(', ') || 'None'),
      spacing: { before: convertInchesToTwip(0.5) }
    })
  ];
}

function createChapterContent(chapter: Chapter, index: number): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: `Chapter ${index + 1}: ${chapter.title}`,
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    })
  ];

  if (chapter.notes) {
    paragraphs.push(
      new Paragraph({
        text: chapter.notes,
        spacing: { before: convertInchesToTwip(0.5) }
      })
    );
  }

  chapter.sections.forEach(section => {
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: convertInchesToTwip(0.5) }
      }),
      new Paragraph({
        text: section.content,
        spacing: { before: convertInchesToTwip(0.25) }
      })
    );

    section.figures.forEach(figure => {
      try {
        paragraphs.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: figure.url,
                transformation: {
                  width: 400,
                  height: 300
                }
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: convertInchesToTwip(0.5), after: convertInchesToTwip(0.25) }
          }),
          new Paragraph({
            text: `Figure: ${figure.caption}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: convertInchesToTwip(0.5) }
          })
        );
      } catch (error) {
        console.warn(`Failed to add figure: ${error}`);
      }
    });
  });

  return paragraphs;
}

function createBibliography(references: Reference[], style: ThesisMetadata['citationStyle']): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: 'References',
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true
    })
  ];

  references.sort((a, b) => {
    const authorA = a.authors[0] || '';
    const authorB = b.authors[0] || '';
    return authorA.localeCompare(authorB);
  }).forEach(ref => {
    let citation = '';
    switch (style) {
      case 'APA':
        citation = `${ref.authors.join(', ')} (${ref.year}). ${ref.title}. ${ref.publisher || ''}.`;
        break;
      case 'MLA':
        citation = `${ref.authors.join(', ')}. "${ref.title}." ${ref.publisher || ''}, ${ref.year}.`;
        break;
      case 'Chicago':
        citation = `${ref.authors.join(', ')}. ${ref.title}. ${ref.publisher || ''}, ${ref.year}.`;
        break;
    }

    paragraphs.push(
      new Paragraph({
        text: citation,
        spacing: { before: convertInchesToTwip(0.25) }
      })
    );
  });

  return paragraphs;
}

export async function exportToDocx({ metadata, chapters, references }: ExportOptions): Promise<void> {
  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: STYLES.heading1
        },
        heading2: {
          run: STYLES.heading2
        },
        document: {
          run: STYLES.normal
        }
      }
    },
    numbering: {
      config: [
        {
          reference: 'heading1',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT
            }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: metadata.title || 'Untitled Thesis',
                alignment: AlignmentType.RIGHT
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT]
                  })
                ]
              })
            ]
          })
        },
        children: [
          ...createTitlePage(metadata),
          ...createTableOfContents(),
          ...createAbstract(metadata),
          ...chapters.flatMap((chapter, index) => createChapterContent(chapter, index)),
          ...createBibliography(references, metadata.citationStyle)
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${metadata.title || 'thesis'}.docx`);
}