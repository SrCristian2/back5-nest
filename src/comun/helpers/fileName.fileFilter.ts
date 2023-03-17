import { v4 as uuid } from 'uuid';

type callBackFunctionVariadic = (...args: any[]) => void;

export const fileName = (
  req: any,
  file: Express.Multer.File,
  callback: callBackFunctionVariadic,
) => {
  if (!file) return callback(new Error('no file selected'));

  const fileExtension = file.mimetype.split('/')[1].toLowerCase();

  const fileName = uuid() + '-' + fileExtension;

  callback(null, fileName);
};
