"use client";

import { useRef, useState } from "react";
import { TabEditor } from "./tab-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TabResult } from "./tab-result";

export default function Demo() {
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [type, setType] = useState("dbz");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor">Code Analyzer</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
      </TabsList>
      <TabsContent value="editor" className="mt-4">
        <TabEditor
          file={file}
          language={language}
          isAnalyzing={isAnalyzing}
          type={type}
          code={code}
          model={model}
          handleChangeLanguage={setLanguage}
          handleChangeResults={setResults}
          handleChangeActiveTab={setActiveTab}
          handleChangeCode={setCode}
          handleChangeIsAnalyzing={setIsAnalyzing}
          handleChangeFile={setFile}
          handleChangeType={setType}
          handleChangeModel={setModel}
        />
      </TabsContent>
      <TabsContent value="results" className="mt-4">
        <TabResult
          results={results}
          isAnalyzing={isAnalyzing}
          type={type}
          code={code}
          handleChangeResults={setResults}
          handleChangeActiveTab={setActiveTab}
          handleChangeCode={setCode}
          handleChangeFile={setFile}
        />
      </TabsContent>
    </Tabs>
  );
}
