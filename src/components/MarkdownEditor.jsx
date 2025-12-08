import React, { useRef, useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineDocumentText,
} from "react-icons/hi2";

/**
 * Custom SVG Icons for the formatting toolbar
 */
const BoldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-4 h-4"
  >
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const StrikethroughIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.1 2.6 3.1 3.4" />
    <path d="M4 12h16" />
    <path d="M17.5 12c1.5.5 2.5 1.3 2.5 2.8 0 3.4-3.7 4.2-6.1 4.2-2.7 0-4.3-.5-6.9-1.5" />
  </svg>
);

const HeadingIcon = ({ level }) => (
  <span className="font-bold text-xs">H{level}</span>
);

const BulletListIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </svg>
);

const NumberedListIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <line x1="10" y1="6" x2="20" y2="6" />
    <line x1="10" y1="12" x2="20" y2="12" />
    <line x1="10" y1="18" x2="20" y2="18" />
    <text
      x="3"
      y="8"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      1
    </text>
    <text
      x="3"
      y="14"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      2
    </text>
    <text
      x="3"
      y="20"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      3
    </text>
  </svg>
);

const CheckboxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const CodeBlockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="8 10 6 12 8 14" />
    <polyline points="16 10 18 12 16 14" />
    <line x1="12" y1="8" x2="12" y2="16" />
  </svg>
);

const QuoteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z" />
  </svg>
);

const LinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const HorizontalRuleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const TableIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

/**
 * Toolbar button component - defined OUTSIDE main component to prevent recreation
 */
function ToolbarButton({ onClick, title, children, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-all duration-150 ${
        active
          ? "bg-green-600/20 text-green-400"
          : "text-gray-500 hover:text-white hover:bg-[#1a1a1a]"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Toolbar divider - defined OUTSIDE main component
 */
function Divider() {
  return <div className="w-px h-5 bg-[#1a1a1a] mx-1" />;
}

/**
 * MarkdownEditor - Rich text editor with formatting toolbar
 * Supports all standard Markdown features with a MS Word/Google Docs-like experience
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content using Markdown...",
  minHeight = "256px",
  showPreview = true,
}) {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState("edit");

  // Focus textarea when switching to edit mode
  useEffect(() => {
    if (activeTab === "edit" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeTab]);

  /**
   * Apply formatting to selected text or insert at cursor
   */
  const applyFormat = useCallback(
    (prefix, suffix = "", defaultText = "", options = {}) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const beforeText = value.substring(0, selectionStart);
      const afterText = value.substring(selectionEnd);

      let newText;
      let newCursorPos;

      if (options.linePrefix) {
        // For line-based formatting (headings, lists)
        const lines = value.split("\n");
        let charCount = 0;
        let lineIndex = 0;

        // Find current line
        for (let i = 0; i < lines.length; i++) {
          if (charCount + lines[i].length >= selectionStart) {
            lineIndex = i;
            break;
          }
          charCount += lines[i].length + 1;
        }

        // Apply prefix to line
        const currentLine = lines[lineIndex];
        if (options.toggle && currentLine.startsWith(prefix)) {
          lines[lineIndex] = currentLine.substring(prefix.length);
        } else {
          // Remove existing line prefixes if replacing
          let cleanLine = currentLine
            .replace(/^#{1,6}\s*/, "")
            .replace(/^[-*+]\s*(\[ \]\s*)?/, "")
            .replace(/^\d+\.\s*/, "")
            .replace(/^>\s*/, "");
          lines[lineIndex] = prefix + cleanLine;
        }

        newText = lines.join("\n");
        newCursorPos = charCount + lines[lineIndex].length;
      } else if (selectedText) {
        // Wrap selected text
        newText = beforeText + prefix + selectedText + suffix + afterText;
        newCursorPos =
          selectionStart + prefix.length + selectedText.length + suffix.length;
      } else {
        // Insert with placeholder
        newText = beforeText + prefix + defaultText + suffix + afterText;
        newCursorPos = selectionStart + prefix.length;
      }

      onChange(newText);

      // Restore focus and cursor position
      requestAnimationFrame(() => {
        textarea.focus();
        if (selectedText || options.linePrefix) {
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        } else {
          // Select the placeholder text
          textarea.setSelectionRange(
            selectionStart + prefix.length,
            selectionStart + prefix.length + defaultText.length
          );
        }
      });
    },
    [value, onChange]
  );

  /**
   * Insert a code block at cursor
   */
  const insertCodeBlock = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const beforeText = value.substring(0, selectionStart);
    const afterText = value.substring(selectionEnd);

    const codeContent = selectedText || "code here";
    const newText =
      beforeText + "\n```\n" + codeContent + "\n```\n" + afterText;

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      const codeStart = selectionStart + 5;
      textarea.setSelectionRange(codeStart, codeStart + codeContent.length);
    });
  }, [value, onChange]);

  /**
   * Insert a table at cursor
   */
  const insertTable = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart } = textarea;
    const beforeText = value.substring(0, selectionStart);
    const afterText = value.substring(selectionStart);

    const table = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`;

    onChange(beforeText + table + afterText);

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [value, onChange]);

  /**
   * Insert a link at cursor
   */
  const insertLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const beforeText = value.substring(0, selectionStart);
    const afterText = value.substring(selectionEnd);

    const linkText = selectedText || "link text";
    const newText = beforeText + "[" + linkText + "](url)" + afterText;

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      // Select "url" for easy replacement
      const urlStart = selectionStart + linkText.length + 3;
      textarea.setSelectionRange(urlStart, urlStart + 3);
    });
  }, [value, onChange]);

  /**
   * Insert an image at cursor
   */
  const insertImage = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart } = textarea;
    const beforeText = value.substring(0, selectionStart);
    const afterText = value.substring(selectionStart);

    const newText = beforeText + "![alt text](image-url)" + afterText;

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      // Select "image-url" for easy replacement
      const urlStart = selectionStart + 12;
      textarea.setSelectionRange(urlStart, urlStart + 9);
    });
  }, [value, onChange]);

  /**
   * Insert horizontal rule at cursor
   */
  const insertHorizontalRule = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart } = textarea;
    const beforeText = value.substring(0, selectionStart);
    const afterText = value.substring(selectionStart);

    onChange(beforeText + "\n---\n" + afterText);

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [value, onChange]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            applyFormat("**", "**", "bold text");
            break;
          case "i":
            e.preventDefault();
            applyFormat("*", "*", "italic text");
            break;
          case "k":
            e.preventDefault();
            insertLink();
            break;
          case "`":
            e.preventDefault();
            applyFormat("`", "`", "code");
            break;
          default:
            break;
        }
      }

      // Handle Tab for indentation
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = textareaRef.current;
        const { selectionStart, selectionEnd } = textarea;
        const beforeText = value.substring(0, selectionStart);
        const afterText = value.substring(selectionEnd);

        const newText = beforeText + "  " + afterText;
        onChange(newText);

        requestAnimationFrame(() => {
          textarea.focus();
          textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
        });
      }
    },
    [applyFormat, insertLink, value, onChange]
  );

  return (
    <div className="markdown-editor">
      {/* Tabs */}
      {showPreview && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activeTab === "edit"
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <HiOutlinePencilSquare className="w-3 h-3" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                activeTab === "preview"
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <HiOutlineEye className="w-3 h-3" />
              Preview
            </button>
          </div>
        </div>
      )}

      {activeTab === "edit" ? (
        <>
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-0.5 p-2 bg-[#0a0a0a] border border-[#1a1a1a] border-b-0 rounded-t">
            {/* Text formatting */}
            <ToolbarButton
              onClick={() => applyFormat("**", "**", "bold text")}
              title="Bold (Ctrl+B)"
            >
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => applyFormat("*", "*", "italic text")}
              title="Italic (Ctrl+I)"
            >
              <ItalicIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => applyFormat("~~", "~~", "strikethrough")}
              title="Strikethrough"
            >
              <StrikethroughIcon />
            </ToolbarButton>

            <Divider />

            {/* Headings */}
            <ToolbarButton
              onClick={() =>
                applyFormat("# ", "", "", { linePrefix: true, toggle: true })
              }
              title="Heading 1"
            >
              <HeadingIcon level={1} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                applyFormat("## ", "", "", { linePrefix: true, toggle: true })
              }
              title="Heading 2"
            >
              <HeadingIcon level={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                applyFormat("### ", "", "", { linePrefix: true, toggle: true })
              }
              title="Heading 3"
            >
              <HeadingIcon level={3} />
            </ToolbarButton>

            <Divider />

            {/* Lists */}
            <ToolbarButton
              onClick={() =>
                applyFormat("- ", "", "", { linePrefix: true, toggle: true })
              }
              title="Bullet List"
            >
              <BulletListIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                applyFormat("1. ", "", "", { linePrefix: true, toggle: true })
              }
              title="Numbered List"
            >
              <NumberedListIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                applyFormat("- [ ] ", "", "", {
                  linePrefix: true,
                  toggle: true,
                })
              }
              title="Checkbox List"
            >
              <CheckboxIcon />
            </ToolbarButton>

            <Divider />

            {/* Code */}
            <ToolbarButton
              onClick={() => applyFormat("`", "`", "code")}
              title="Inline Code (Ctrl+`)"
            >
              <CodeIcon />
            </ToolbarButton>
            <ToolbarButton onClick={insertCodeBlock} title="Code Block">
              <CodeBlockIcon />
            </ToolbarButton>

            <Divider />

            {/* Quote */}
            <ToolbarButton
              onClick={() =>
                applyFormat("> ", "", "", { linePrefix: true, toggle: true })
              }
              title="Blockquote"
            >
              <QuoteIcon />
            </ToolbarButton>

            {/* Link & Image */}
            <ToolbarButton onClick={insertLink} title="Link (Ctrl+K)">
              <LinkIcon />
            </ToolbarButton>
            <ToolbarButton onClick={insertImage} title="Image">
              <ImageIcon />
            </ToolbarButton>

            <Divider />

            {/* Table & HR */}
            <ToolbarButton onClick={insertTable} title="Table">
              <TableIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={insertHorizontalRule}
              title="Horizontal Rule"
            >
              <HorizontalRuleIcon />
            </ToolbarButton>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-black border border-[#1a1a1a] rounded-b px-3 py-2 text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-[#2a2a2a] resize-none custom-scrollbar font-mono"
            style={{ minHeight }}
          />

          {/* Markdown help hint */}
          <p className="text-[10px] text-gray-600 mt-1.5 flex items-center gap-2">
            <span>
              Supports full Markdown: headings, formatting, lists, code, tables,
              and more.
            </span>
            <span className="text-gray-700">•</span>
            <span>Ctrl+B Bold • Ctrl+I Italic • Ctrl+K Link</span>
          </p>
        </>
      ) : (
        /* Preview Mode */
        <div
          className="bg-black border border-[#1a1a1a] rounded px-4 py-3 overflow-y-auto custom-scrollbar"
          style={{ minHeight }}
        >
          {value ? (
            <div className="prose-terminal text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic flex items-center gap-2">
              <HiOutlineDocumentText className="w-4 h-4" />
              No content yet. Switch to Edit mode to start writing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
