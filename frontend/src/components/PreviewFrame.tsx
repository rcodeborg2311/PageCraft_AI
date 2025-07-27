import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState, useCallback } from 'react';
import { Monitor, Loader2, Play } from 'lucide-react';

interface PreviewFrameProps {
  files: unknown[];
  webContainer: WebContainer | undefined;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const main = useCallback(async () => {
    if (!webContainer) {
      setError("WebContainer not available");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));

      await webContainer.spawn('npm', ['run', 'dev']);

      // Wait for `server-ready` event
      webContainer.on('server-ready', (port, url) => {
        console.log(url);
        console.log(port);
        setUrl(url);
        setIsLoading(false);
      });
    } catch (err) {
      setError("Failed to start preview server");
      setIsLoading(false);
      console.error(err);
    }
  }, [webContainer]);

  useEffect(() => {
    if (files.length > 0) {
      main();
    }
  }, [files, webContainer, main]);

  if (!webContainer) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
          <Monitor className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Preview Unavailable</h3>
        <p className="text-sm text-zinc-600 text-center max-w-xs">
          WebContainer is not ready. Please wait for initialization.
        </p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">No Files to Preview</h3>
        <p className="text-sm text-zinc-600 text-center max-w-xs">
          Generate some files first to see the live preview
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500">
        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
          <Monitor className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Preview Error</h3>
        <p className="text-sm text-zinc-600 text-center max-w-xs">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden border border-zinc-800">
      <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-300">Live Preview</span>
        {isLoading && (
          <div className="ml-auto flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
            <span className="text-xs text-zinc-500">Starting server...</span>
          </div>
        )}
      </div>
      
      <div className="h-[calc(100%-40px)] bg-white">
        {isLoading && !url ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-zinc-500 text-sm mt-3 font-medium">Starting preview server...</p>
          </div>
        ) : url ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={url}
            className="border-0"
            title="Live Preview"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500">
            <p className="text-sm">Waiting for server...</p>
          </div>
        )}
      </div>
    </div>
  );
}