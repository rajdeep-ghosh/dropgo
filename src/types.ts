export type UploadAPIReqPayload = {
  name: string;
  size: number;
  type: string;
};

export type UploadAPIRespData = {
  success: {
    _id: string;
    name: string;
    size: number;
    type: string;
    key: string;
    expires: Date;
    url: string;
    created_at: Date;
  };
  error: string;
};

export type DropAPIRespData = Pick<UploadAPIRespData, 'success'>;
