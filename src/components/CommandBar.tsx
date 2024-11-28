import React, { useState } from 'react';
import { useThesisStore } from '../store/thesisStore';
import { COMMANDS } from '../utils/commands';
import { CommandHelp } from './CommandHelp';
import { Terminal, Send } from 'lucide-react';
import { exportToDocx } from '../utils/docxExport';

export function CommandBar() {
  const [command, setCommand] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [helpCommand, setHelpCommand] = useState<string>();
  const [errorMessage, setErrorMessage] = useState('');
  const [commandOutput, setCommandOutput] = useState('');
  const store = useThesisStore();

  const handleCommand = async (input: string) => {
    setErrorMessage('');
    setCommandOutput('');

    const [cmd, ...args] = input.split(' ');
    const argument = args.join(' ');

    try {
      switch (cmd) {
        case `/${COMMANDS.START}`:
          setCommandOutput('Welcome to Thesis Creator Helper! Type /help to see available commands.');
          break;

        case `/${COMMANDS.HELP}`:
          setHelpCommand(args[0]);
          setShowHelp(true);
          break;

        case `/${COMMANDS.ABOUT}`:
          setCommandOutput('Thesis Creator Helper v1.0.0\nA powerful tool for creating and managing your thesis.');
          break;

        case `/${COMMANDS.SETTINGS}`:
          store.setMetadata({
            ...store.metadata,
            showSettings: true
          });
          break;

        case `/${COMMANDS.STATUS}`: {
          const chapters = store.listChapters();
          const references = store.searchReferences('');
          const wordCount = chapters.reduce((acc, chapter) => 
            acc + chapter.sections.reduce((secAcc, section) => 
              secAcc + section.content.trim().split(/\s+/).length, 0
            ), 0
          );

          setCommandOutput(`
            Thesis Status:
            - Title: ${store.metadata.title || 'Not set'}
            - Chapters: ${chapters.length}
            - Total Words: ${wordCount}
            - References: ${references.length}
            - Current Template: ${store.metadata.template}
            - Citation Style: ${store.metadata.citationStyle}
            - Target Date: ${store.metadata.targetDate || 'Not set'}
            - Word Count Goal: ${store.metadata.wordCountGoal || 'Not set'}
          `);
          break;
        }

        case `/${COMMANDS.SET_TITLE}`:
          store.setMetadata({ title: argument });
          setCommandOutput(`Title set to: ${argument}`);
          break;

        case `/${COMMANDS.SET_FIELD}`:
          store.setMetadata({ field: argument });
          setCommandOutput(`Field set to: ${argument}`);
          break;

        case `/${COMMANDS.SET_SUPERVISOR}`:
          store.setMetadata({ supervisor: argument });
          setCommandOutput(`Supervisor set to: ${argument}`);
          break;

        case `/${COMMANDS.SET_UNIVERSITY}`:
          store.setMetadata({ university: argument });
          setCommandOutput(`University set to: ${argument}`);
          break;

        case `/${COMMANDS.INITIALIZE_TEMPLATE}`:
          if (['APA', 'MLA', 'Chicago'].includes(argument)) {
            store.setMetadata({ template: argument as 'APA' | 'MLA' | 'Chicago' });
            setCommandOutput(`Template initialized with: ${argument}`);
          } else {
            throw new Error('Invalid template. Use APA, MLA, or Chicago');
          }
          break;

        case `/${COMMANDS.ADD_CHAPTER}`:
          store.addChapter(argument);
          setCommandOutput(`Chapter added: ${argument}`);
          break;

        case `/${COMMANDS.LIST_CHAPTERS}`:
          const chapters = store.listChapters();
          setCommandOutput(chapters.map(ch => `${ch.id}: ${ch.title}`).join('\n'));
          break;

        case `/${COMMANDS.EDIT_CHAPTER}`: {
          const [chapterId, ...titleParts] = args;
          store.editChapter(chapterId, titleParts.join(' '));
          setCommandOutput(`Chapter ${chapterId} updated`);
          break;
        }

        case `/${COMMANDS.DELETE_CHAPTER}`:
          store.deleteChapter(args[0]);
          setCommandOutput(`Chapter deleted: ${args[0]}`);
          break;

        case `/${COMMANDS.REORDER_CHAPTERS}`:
          store.reorderChapters(args);
          setCommandOutput('Chapters reordered');
          break;

        case `/${COMMANDS.ADD_SECTION}`: {
          const [chapterId, ...titleParts] = args;
          store.addSection(chapterId, titleParts.join(' '));
          setCommandOutput(`Section added to chapter ${chapterId}`);
          break;
        }

        case `/${COMMANDS.LIST_SECTIONS}`:
          if (!args[0]) throw new Error('Please provide a chapter ID');
          const sections = store.listSections(args[0]);
          setCommandOutput(sections.map(sec => `${sec.id}: ${sec.title}`).join('\n'));
          break;

        case `/${COMMANDS.EDIT_SECTION}`: {
          const [chapterId, sectionId, ...titleParts] = args;
          store.editSection(chapterId, sectionId, titleParts.join(' '));
          setCommandOutput(`Section ${sectionId} updated`);
          break;
        }

        case `/${COMMANDS.DELETE_SECTION}`: {
          const [chapterId, sectionId] = args;
          store.deleteSection(chapterId, sectionId);
          setCommandOutput(`Section ${sectionId} deleted`);
          break;
        }

        case `/${COMMANDS.MERGE_SECTIONS}`: {
          const [chapterId, sourceId, targetId] = args;
          store.mergeSections(chapterId, sourceId, targetId);
          setCommandOutput(`Sections merged`);
          break;
        }

        case `/${COMMANDS.ADD_CONTENT}`: {
          const [sectionId, ...contentParts] = args;
          store.addContent(sectionId, contentParts.join(' '));
          setCommandOutput(`Content added to section ${sectionId}`);
          break;
        }

        case `/${COMMANDS.EDIT_CONTENT}`: {
          const [sectionId, ...contentParts] = args;
          store.editContent(sectionId, contentParts.join(' '));
          setCommandOutput(`Content updated for section ${sectionId}`);
          break;
        }

        case `/${COMMANDS.VIEW_CONTENT}`:
          if (!args[0]) {
            throw new Error('Please provide a section ID');
          }
          const content = store.viewContent(args[0]);
          setCommandOutput(content);
          break;

        case `/${COMMANDS.EXPORT_CONTENT}`:
          try {
            await exportToDocx({
              metadata: store.metadata,
              chapters: store.chapters,
              references: store.references
            });
            setCommandOutput('Thesis exported successfully as DOCX');
          } catch (error) {
            throw new Error('Failed to export thesis: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
          break;

        case `/${COMMANDS.ADD_REFERENCE}`:
          try {
            const reference = JSON.parse(argument);
            store.addReference(reference);
            setCommandOutput('Reference added successfully');
          } catch (e) {
            throw new Error('Invalid reference format');
          }
          break;

        case `/${COMMANDS.SEARCH_REFERENCES}`: {
          const results = store.searchReferences(argument);
          setCommandOutput(
            results.length > 0
              ? results.map(ref => `${ref.authors.join(', ')} (${ref.year}). ${ref.title}`).join('\n')
              : 'No references found'
          );
          break;
        }

        case `/${COMMANDS.GENERATE_BIBLIOGRAPHY}`: {
          const bibliography = store.generateBibliography();
          setCommandOutput(bibliography);
          break;
        }

        case `/${COMMANDS.SET_CITATION_STYLE}`:
          if (['APA', 'MLA', 'Chicago'].includes(argument)) {
            store.setMetadata({ citationStyle: argument as 'APA' | 'MLA' | 'Chicago' });
            setCommandOutput(`Citation style set to: ${argument}`);
          } else {
            throw new Error('Invalid citation style. Use APA, MLA, or Chicago');
          }
          break;

        case `/${COMMANDS.ADD_FIGURE}`: {
          const [sectionId, url, ...captionParts] = args;
          store.addFigure(sectionId, {
            url,
            caption: captionParts.join(' '),
            altText: captionParts.join(' ')
          });
          setCommandOutput(`Figure added to section ${sectionId}`);
          break;
        }

        case `/${COMMANDS.REMOVE_FIGURE}`: {
          const [sectionId, figureId] = args;
          store.removeFigure(sectionId, figureId);
          setCommandOutput(`Figure ${figureId} removed`);
          break;
        }

        case `/${COMMANDS.LIST_FIGURES}`: {
          const figures = store.listFigures(args[0]);
          setCommandOutput(
            figures.map(fig => `${fig.id}: ${fig.caption} (${fig.url})`).join('\n')
          );
          break;
        }

        case `/${COMMANDS.UPDATE_CAPTION}`: {
          const [sectionId, figureId, ...captionParts] = args;
          store.updateCaption(sectionId, figureId, captionParts.join(' '));
          setCommandOutput(`Caption updated for figure ${figureId}`);
          break;
        }

        default:
          throw new Error(`Unknown command: ${cmd}`);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
    
    setCommand('');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(command);
                }
              }}
              placeholder="Enter command (type /help for options)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleCommand(command)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {errorMessage && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          {commandOutput && (
            <div className="mt-2 p-2 bg-gray-100 rounded whitespace-pre-wrap font-mono text-sm">
              {commandOutput}
            </div>
          )}
        </div>
      </div>

      {showHelp && (
        <CommandHelp
          command={helpCommand}
          onClose={() => {
            setShowHelp(false);
            setHelpCommand(undefined);
          }}
        />
      )}
    </>
  );
}