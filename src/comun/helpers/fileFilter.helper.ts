type callBackFunctionVariadic = (...args: any[]) => void;

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: callBackFunctionVariadic,
) => {
  if (!file) return callback(new Error('no file selected'));

  const fileExtension = file.mimetype.split('/')[1].toLowerCase();

  const validExtension = ['jpg', 'jpeg', 'png', 'svg', 'gif'];

  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }

  req.fileValidationError =
    "El archivo no es valido debe ser 'jpg', 'jpeg', 'png', 'svg', 'gif'";

  callback(null, false);
};
