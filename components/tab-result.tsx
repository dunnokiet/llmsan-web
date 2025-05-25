import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  CircleDot,
  CircleEllipsis,
  Code2,
  Loader2,
  Wand2,
} from "lucide-react";

import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function TabResult({
  type,
  results,
  isAnalyzing,
  fileName,
  handleChangeSantizedCode,
  handleChangeActiveTab,
}: any) {
  const [isGeneratingFixes, setIsGeneratingFixes] = useState(false);

  const handleGenerateFixes = async () => {
    if (isGeneratingFixes || results.length === 0) {
      if (results.length === 0) {
        toast.error("Please analyze code first");
      }
      return;
    }

    setIsGeneratingFixes(true);

    console.log(fileName);

    try {
      const response = await fetch(
        `http://localhost:3000/api/sanitize?file_name=${fileName}&model_name=gpt-4.1-mini&bug_type=${type}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sanitized code");
      }

      const sanitizedCode = await response.text();

      console.log(sanitizedCode);

      handleChangeSantizedCode(sanitizedCode);
      handleChangeActiveTab("sanitized");
      toast.success("Generated fixes for detected bugs");
      setIsGeneratingFixes(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate fixes");
      setIsGeneratingFixes(false);
    }
  };

  const getBugTypeLabel = (type: string) => {
    switch (type) {
      case "dbz":
        return "Divide by Zero";
      case "npd":
        return "NULL Pointer Dereference";
      case "xss":
        return "Cross-Site Scripting (XSS)";
      case "ci":
        return "OS Command Injection";
      case "apt":
        return "Absolute Path Traversal";
      default:
        return type;
    }
  };

  const getStageIcon = (result: any) => {
    if (result.stage === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (result.stage === "started") {
      return <CircleDot className="h-5 w-5 text-green-500" />;
    } else if (result.stage === "detection") {
      return <Circle className="h-5 w-5 text-amber-500" />;
    } else if (result.stage === "trace_result") {
      return <CircleEllipsis className="h-5 w-5 " />;
    } else if (result.result === true) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (result.result === false) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Circle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStageLabel = (stage: string) => {
    return stage
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderTraceDetails = (trace: any) => {
    if (!trace || !Array.isArray(trace)) return null;

    return (
      <div className="ml-7 mt-2 p-3 bg-primary/5 rounded-md text-sm">
        <h4 className="font-medium mb-2">Trace Details:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {trace.map((item, idx) => (
            <li key={idx}>
              Line {item[0]}: Variable{" "}
              <code className="bg-background px-1 rounded">{item[1]}</code>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResultSummary = () => {
    const finalResult = results.find(
      (r: any) => r.stage === "completed"
    )?.final_result;

    if (!finalResult) return null;

    if (finalResult.total == 0) return null;

    return (
      <div className="mt-6 p-4 border rounded-lg bg-background">
        <h3 className="text-lg font-medium mb-3">Analysis Summary</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Type Sanitize:</span>
              <Badge
                variant={
                  finalResult.type_sanitize > 0 ? "default" : "destructive"
                }
              >
                {finalResult.type_sanitize}/{finalResult.total}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Functionality Sanitize:</span>
              <Badge
                variant={
                  finalResult.functionality_sanitize > 0
                    ? "default"
                    : "destructive"
                }
              >
                {finalResult.functionality_sanitize}/{finalResult.total}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order Sanitize:</span>
              <Badge
                variant={
                  finalResult.order_sanitize > 0 ? "default" : "destructive"
                }
              >
                {finalResult.order_sanitize}/{finalResult.total}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Reachability Sanitize:</span>
              <Badge
                variant={
                  finalResult.reachability_sanitize > 0
                    ? "default"
                    : "destructive"
                }
              >
                {finalResult.reachability_sanitize}/{finalResult.total}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <Badge
              variant={
                finalResult.order_sanitize > 0 ? "default" : "destructive"
              }
            >
              {finalResult.total}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Final:</span>
            <Badge
              variant={
                finalResult.order_sanitize > 0 ? "default" : "destructive"
              }
            >
              {finalResult.final}
            </Badge>
          </div>
        </div>
        {finalResult && (
          <div className="mt-6">
            <Button
              onClick={handleGenerateFixes}
              className="w-full"
              disabled={isGeneratingFixes}
            >
              {isGeneratingFixes ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Fixes...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Fixes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderTraceResult = (result: any) => {
    return (
      <div className="ml-7 mt-2 p-3 bg-muted rounded-md text-sm">
        <div className="flex justify-between font-medium">
          <div>Type Sanitize: {result.type_sanitize}</div>
          <div>Functionality Sanitize: {result.functionality_sanitize}</div>
          <div>Orde Sanitize: {result.order_sanitize}</div>
          <div>Reachability Sanitize: {result.reachability_sanitize}</div>
        </div>
      </div>
    );
  };

  const renderDetectionOutput = (output: any) => {
    if (!output || !Array.isArray(output)) return null;

    const bugCount = output[0];
    const bugExplanations = output[2];

    return (
      <div className="ml-7 mt-2 p-3 bg-amber-50 rounded-md text-sm">
        <h4 className="font-medium mb-2">Detection Results:</h4>
        <p className="mb-2">Found {bugCount} potential bug(s)</p>
        <div className="space-y-3">
          {bugExplanations.map((explanation: string, idx: number) => (
            <div key={idx} className="p-2 bg-background rounded border">
              {explanation}
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bug Detection Results</CardTitle>
        <CardDescription>
          Log of detected bugs and sanitization results
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map((result: any, index: any) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStageIcon(result)}
                    <span className="font-medium">
                      {getStageLabel(result.stage)}
                    </span>
                    {result.stage === "detection" && (
                      <Badge variant="outline" className="ml-2">
                        {getBugTypeLabel(type)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {result.timestamp
                      ? new Date(result.timestamp).toLocaleTimeString()
                      : ""}
                  </span>
                </div>

                {result.message && (
                  <p className="text-sm text-muted-foreground ml-7">
                    {result.message}
                  </p>
                )}

                {result.trace && renderTraceDetails(result.trace)}

                {result.output && renderDetectionOutput(result.output)}

                {result.stage === "trace_result" &&
                  renderTraceResult(result.result)}

                {result.reason && result.reason.wrong_flow_response && (
                  <div className="ml-7 mt-2 p-3 bg-destructive/5 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Analysis Details:</h4>
                    <p className="whitespace-pre-line">
                      {result.reason.wrong_flow_response}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {renderResultSummary()}
            {isAnalyzing && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Analyzing...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Code2 className="h-12 w-12 mb-4" />
            <p>No analysis results yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
