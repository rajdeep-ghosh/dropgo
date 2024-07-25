type FileMeta =
  | {
      status: 'success';
      data: {
        id: string;
        url: string;
      };
    }
  | { status: 'error'; message: string };

type FileData =
  | {
      status: 'success';
      data: {
        id: string;
        name: string;
        size: number;
        type: string;
        key: string;
        expiresAt: Date;
        url: string;
      };
    }
  | { status: 'error'; message: string };

export type { FileMeta, FileData };
