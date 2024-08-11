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
