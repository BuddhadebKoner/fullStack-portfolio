"use client";

import React from "react";
import { CodeBlock } from "@/components/ui/code-block";

interface CodeSectionForBlogProps {
  code: string;
  language: string;
  filename?: string;
  highlightLines?: number[];
}

export function CodeSectionForBlog({ 
  code, 
  language, 
  filename,
  highlightLines 
}: CodeSectionForBlogProps) {
  return (
    <div className=" mx-auto w-full my-6">
      <CodeBlock
        language={language}
        filename={filename || `code.${language}`}
        code={code}
        highlightLines={highlightLines}
      />
    </div>
  );
}
