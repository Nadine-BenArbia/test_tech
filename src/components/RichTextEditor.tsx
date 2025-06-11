"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  TextIcon as TextSize,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Font 
const FONT_OPTIONS = [
  { name: "Default", value: "inherit" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
]

// Font size 
const FONT_SIZE_OPTIONS = [
  { name: "Small", value: "12px" },
  { name: "Normal", value: "16px" },
  { name: "Medium", value: "18px" },
  { name: "Large", value: "24px" },
  { name: "X-Large", value: "32px" },
]

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showFontDropdown, setShowFontDropdown] = useState(false)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)
  const [currentFont, setCurrentFont] = useState(FONT_OPTIONS[0])
  const [currentSize, setCurrentSize] = useState(FONT_SIZE_OPTIONS[1])


  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
    }
  }, [onChange])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleInput()
    },
    [handleInput],
  )

  const insertHTML = useCallback(
    (html: string) => {
      if (document.queryCommandSupported("insertHTML")) {
        document.execCommand("insertHTML", false, html)
      } else {
        // Fallback for browsers that don't support insertHTML
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          const div = document.createElement("div")
          div.innerHTML = html
          const frag = document.createDocumentFragment()
          let node
          while ((node = div.firstChild)) {
            frag.appendChild(node)
          }
          range.insertNode(frag)
        }
      }
      handleInput()
    },
    [handleInput],
  )

  const formatBlock = useCallback(
    (tag: string) => {
      execCommand("formatBlock", `<${tag}>`)
    },
    [execCommand],
  )

  const createList = useCallback(
    (ordered: boolean) => {
      const selection = window.getSelection()
      if (selection && selection.toString()) {
        // If text is selected, convert it to a list
        const selectedText = selection.toString()
        const lines = selectedText.split("\n").filter((line) => line.trim())

        if (ordered) {
          const listHTML = "<ol>" + lines.map((line) => `<li>${line.trim()}</li>`).join("") + "</ol>"
          insertHTML(listHTML)
        } else {
          const listHTML = "<ul>" + lines.map((line) => `<li>${line.trim()}</li>`).join("") + "</ul>"
          insertHTML(listHTML)
        }
      } else {
        // No selection, just create a list
        execCommand(ordered ? "insertOrderedList" : "insertUnorderedList")
      }
    },
    [execCommand, insertHTML],
  )

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }, [execCommand])

  const setFontFamily = useCallback(
    (fontFamily: string) => {
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        if (selection.toString() === "") {
        
          if (editorRef.current) {
            editorRef.current.style.fontFamily = fontFamily
          }
        } else {
          
          const span = document.createElement("span")
          span.style.fontFamily = fontFamily

          try {
            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)

           
            range.selectNodeContents(span)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (error) {
            console.error("Error applying font:", error)
          
            execCommand("fontName", fontFamily)
          }
        }
      } else {
       
        if (editorRef.current) {
          editorRef.current.style.fontFamily = fontFamily
        }
      }

      setCurrentFont(FONT_OPTIONS.find((f) => f.value === fontFamily) || FONT_OPTIONS[0])
      setShowFontDropdown(false)
      handleInput()
    },
    [execCommand, handleInput],
  )

  const setFontSize = useCallback(
    (fontSize: string) => {
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        if (selection.toString() === "") {
        
          if (editorRef.current) {
            editorRef.current.style.fontSize = fontSize
          }
        } else {
          
          const span = document.createElement("span")
          span.style.fontSize = fontSize

          try {
            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)

            
            range.selectNodeContents(span)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (error) {
            console.error("Error applying font size:", error)
           
            document.execCommand("fontSize", false, "7")
            const fontElements = editorRef.current?.querySelectorAll('font[size="7"]')
            fontElements?.forEach((el) => {
              (el as HTMLElement).style.fontSize = fontSize
              el.removeAttribute("size")
            })
          }
        }
      } else {
        // No selection, apply to entire editor
        if (editorRef.current) {
          editorRef.current.style.fontSize = fontSize
        }
      }

      setCurrentSize(FONT_SIZE_OPTIONS.find((s) => s.value === fontSize) || FONT_SIZE_OPTIONS[1])
      setShowSizeDropdown(false)
      handleInput()
    },
    [handleInput],
  )

  const toolbarButtons = [
    {
      icon: Type,
      label: "Heading",
      onClick: () => formatBlock("h2"),
    },
    {
      icon: Bold,
      label: "Bold",
      onClick: () => execCommand("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      onClick: () => execCommand("italic"),
    },
    {
      icon: Underline,
      label: "Underline",
      onClick: () => execCommand("underline"),
    },
    {
      icon: List,
      label: "Bullet List",
      onClick: () => createList(false),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      onClick: () => createList(true),
    },
    {
      icon: Quote,
      label: "Quote",
      onClick: () => formatBlock("blockquote"),
    },
    {
      icon: Link,
      label: "Link",
      onClick: insertLink,
    },
    {
      icon: AlignLeft,
      label: "Align Left",
      onClick: () => execCommand("justifyLeft"),
    },
    {
      icon: AlignCenter,
      label: "Align Center",
      onClick: () => execCommand("justifyCenter"),
    },
    {
      icon: AlignRight,
      label: "Align Right",
      onClick: () => execCommand("justifyRight"),
    },
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
   
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
       
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            className="h-8 px-2 hover:bg-gray-200 flex items-center gap-1"
            title="Font Family"
          >
            <span className="text-xs">Font</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  style={{ fontFamily: font.value }}
                  onClick={() => setFontFamily(font.value)}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

       
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
            className="h-8 px-2 hover:bg-gray-200 flex items-center gap-1"
            title="Font Size"
          >
            <TextSize className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {FONT_SIZE_OPTIONS.map((size) => (
                <button
                  key={size.value}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  style={{ fontSize: size.value }}
                  onClick={() => setFontSize(size.value)}
                >
                  {size.name}
                </button>
              ))}
            </div>
          )}
        </div>

      
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

     
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] p-4 focus:outline-none"
        style={{
          lineHeight: "1.6",
          fontSize: "14px",
        }}
        data-placeholder={placeholder || "Write your content here..."}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}
