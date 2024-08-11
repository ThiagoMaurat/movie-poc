"use client";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";

interface WebTorrent {
  new (): WebTorrentInstance;
  (options?: any): WebTorrentInstance;
  version: string;
}

interface WebTorrentInstance {
  add(magnetURI: string, options: any, callback: (torrent: any) => void): void;
  destroy(callback?: () => void): void;
}

declare global {
  interface Window {
    WebTorrent: WebTorrent;
  }
}

const TorrentPlayer = ({ magnetURI }: { magnetURI: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebTorrentLoaded, setIsWebTorrentLoaded] = useState(false);

  // Carrega o script WebTorrent e define o estado quando está pronto
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/webtorrent@1.8.0/webtorrent.min.js";
    script.onload = () => setIsWebTorrentLoaded(true);
    script.onerror = () => console.error("Failed to load WebTorrent script");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Usa WebTorrent quando o script estiver carregado
  useEffect(() => {
    if (!isWebTorrentLoaded || typeof window === "undefined") return;

    const WebTorrent = window.WebTorrent as any;

    console.log(WebTorrent);
    if (!WebTorrent) {
      console.error("WebTorrent library is not available");
      return;
    }

    const torrentClient = new WebTorrent();
    torrentClient.add(magnetURI, (torrent: any) => {
      const file = torrent.files.find((file: any) =>
        file.name.endsWith(".mp4")
      );
      if (file && videoRef.current) {
        file.renderTo(videoRef.current, {
          autoplay: true,
          controls: true,
        });
      }
    });

    return () => {
      torrentClient.destroy();
    };
  }, [magnetURI, isWebTorrentLoaded]);

  return (
    <>
      <Head>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
        />
      </Head>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
    </>
  );
};

export default TorrentPlayer;
