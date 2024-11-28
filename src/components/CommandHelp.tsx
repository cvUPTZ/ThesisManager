import React from 'react';
import { HELP_TEXT } from '../utils/helpText';
import { COMMANDS } from '../utils/commands';
import { Terminal, HelpCircle } from 'lucide-react';

interface CommandHelpProps {
  command?: string;
  onClose: () => void;
}

export function CommandHelp({ command, onClose }: CommandHelpProps) {
  const renderCommandHelp = (cmd: string) => {
    const help = HELP_TEXT[cmd];
    return (
      <div key={cmd} className="border-b border-gray-100 p-4">
        <div className="flex items-start gap-2">
          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-blue-600">
            {help.syntax}
          </code>
        </div>
        <p className="mt-2 text-gray-600">{help.description}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Example:</p>
          <code className="block mt-1 px-2 py-1 bg-gray-50 rounded text-sm font-mono text-gray-600">
            {help.example}
          </code>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            {command ? `Help: ${command}` : 'Available Commands'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          {command ? (
            HELP_TEXT[command] ? (
              renderCommandHelp(command)
            ) : (
              <p className="text-red-500">Command not found: {command}</p>
            )
          ) : (
            Object.keys(COMMANDS).map((cmd) => renderCommandHelp(COMMANDS[cmd]))
          )}
        </div>
      </div>
    </div>
  );
}