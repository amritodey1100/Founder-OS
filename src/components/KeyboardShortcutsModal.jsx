import React from "react";
import Modal from "./Modal";
import { HiOutlineCommandLine } from "react-icons/hi2";

/**
 * Custom keyboard icon for the header button
 */
export function KeyboardShortcutsIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
      <path d="M18 10h.01" />
      <path d="M8 14h8" />
    </svg>
  );
}

/**
 * Keyboard shortcut display component
 */
function Shortcut({ keys, description }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-b-0">
      <span className="text-gray-300 text-sm">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <kbd className="inline-flex items-center justify-center px-2 py-1 text-xs font-mono bg-[#1a1a1a] text-gray-300 rounded border border-[#2a2a2a] min-w-[24px]">
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-gray-600">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Section header for shortcut groups
 */
function ShortcutSection({ title, children }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-3">
        {children}
      </div>
    </div>
  );
}

/**
 * KeyboardShortcutsModal - Professional guide for keyboard shortcuts
 */
export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="lg"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-center w-10 h-10 bg-green-600/10 border border-green-600/20 rounded-lg">
            <HiOutlineCommandLine className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-medium">
              Markdown Editor Shortcuts
            </h3>
            <p className="text-xs text-gray-500">
              Speed up your writing with these keyboard shortcuts
            </p>
          </div>
        </div>

        {/* Text Formatting */}
        <ShortcutSection title="Text Formatting">
          <Shortcut keys={["Ctrl", "B"]} description="Bold text" />
          <Shortcut keys={["Ctrl", "I"]} description="Italic text" />
          <Shortcut keys={["Ctrl", "`"]} description="Inline code" />
          <Shortcut keys={["Ctrl", "K"]} description="Insert link" />
        </ShortcutSection>

        {/* Editor Navigation */}
        <ShortcutSection title="Editor Navigation">
          <Shortcut keys={["Tab"]} description="Indent (2 spaces)" />
          <Shortcut keys={["Esc"]} description="Close modal" />
        </ShortcutSection>

        {/* Markdown Syntax Reference */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2">
            Markdown Syntax Quick Reference
          </h4>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-gray-400">
                  <span className="text-cyan-400"># </span>
                  <span className="text-gray-300">Heading 1</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">## </span>
                  <span className="text-gray-300">Heading 2</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">**</span>
                  <span className="text-gray-300">bold</span>
                  <span className="text-cyan-400">**</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">*</span>
                  <span className="text-gray-300">italic</span>
                  <span className="text-cyan-400">*</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">~~</span>
                  <span className="text-gray-300">strikethrough</span>
                  <span className="text-cyan-400">~~</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400">
                  <span className="text-cyan-400">- </span>
                  <span className="text-gray-300">Bullet list</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">1. </span>
                  <span className="text-gray-300">Numbered list</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">- [ ] </span>
                  <span className="text-gray-300">Checkbox</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">&gt; </span>
                  <span className="text-gray-300">Blockquote</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">`</span>
                  <span className="text-gray-300">code</span>
                  <span className="text-cyan-400">`</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
              <div className="text-gray-400 mb-1">
                <span className="text-cyan-400">[</span>
                <span className="text-gray-300">text</span>
                <span className="text-cyan-400">](</span>
                <span className="text-gray-300">url</span>
                <span className="text-cyan-400">)</span>
                <span className="text-gray-600 ml-2">— Link</span>
              </div>
              <div className="text-gray-400 mb-1">
                <span className="text-cyan-400">![</span>
                <span className="text-gray-300">alt</span>
                <span className="text-cyan-400">](</span>
                <span className="text-gray-300">image-url</span>
                <span className="text-cyan-400">)</span>
                <span className="text-gray-600 ml-2">— Image</span>
              </div>
              <div className="text-gray-400">
                <span className="text-cyan-400">```</span>
                <span className="text-gray-300"> code block </span>
                <span className="text-cyan-400">```</span>
                <span className="text-gray-600 ml-2">— Code Block</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro tip */}
        <div className="flex items-start gap-3 p-3 bg-green-600/5 border border-green-600/20 rounded">
          <span className="text-green-500 text-lg">💡</span>
          <p className="text-xs text-gray-400">
            <span className="text-green-400 font-medium">Pro Tip:</span> Select
            text first, then click a formatting button or use a shortcut to wrap
            the selected text automatically.
          </p>
        </div>
      </div>
    </Modal>
  );
}
