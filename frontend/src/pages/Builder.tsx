import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';
import { Send, Sparkles } from 'lucide-react';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    async function startServer() {
      if (webcontainer) {
        await webcontainer.mount(mountStructure);
        try {
          // Install dependencies
          const install = await webcontainer.spawn('npm', ['install']);
          await install.exit;
          // Start dev server
          const server = await webcontainer.spawn('npm', ['run', 'dev']);
          // Listen for server output to get the preview URL
          server.output.pipeTo(new WritableStream({
            write(data) {
              const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
              const match = text.match(/(http:\/\/localhost:\d+)/);
              if (match) {
                setPreviewUrl(match[1].replace('localhost', '127.0.0.1'));
              }
            }
          }));
        } catch (err) {
          console.error('WebContainer error:', err);
        }
      }
    }
    startServer();
  }, [files, webcontainer]);

  const init = useCallback(async () => {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as const
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }, [prompt]);

  useEffect(() => {
    init();
  }, [init])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Website Builder</h1>
        </div>
        <p className="text-zinc-400 text-sm font-medium">Building from: "{prompt}"</p>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-6 p-6">
          {/* Left Sidebar - Steps */}
          <div className="col-span-3">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 h-[calc(100vh-12rem)] flex flex-col">
              {/* Steps List - Scrollable */}
              <div className="flex-1 overflow-auto min-h-0">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              
              {/* Chat Input - Fixed at bottom */}
              <div className="mt-6 pt-6 border-t border-zinc-800 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <h3 className="text-sm font-semibold text-white">Continue Building</h3>
                </div>
                
                {(loading || !templateSet) && <Loader />}
                {!(loading || !templateSet) && (
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea 
                        value={userPrompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask for changes or improvements... (e.g., 'Add a contact form', 'Make it more colorful', 'Add animations')"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-sm"
                        rows={3}
                      />
                      <button 
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as const,
                            content: userPrompt
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          setLoading(false);

                          setLlmMessages(x => [...x, newMessage]);
                          setLlmMessages(x => [...x, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);
                          
                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as const
                          }))]);

                        }} 
                        className="absolute bottom-3 right-3 bg-white text-black p-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!userPrompt.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500">
                      💡 Try asking for specific changes like "Add a navigation menu" or "Make the design more modern"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Explorer */}
          <div className="col-span-2">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>

          {/* Main Editor/Preview Area */}
          <div className="col-span-7 bg-zinc-900 rounded-xl border border-zinc-800 p-6 h-[calc(100vh-12rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)] mt-4">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} previewUrl={previewUrl} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}