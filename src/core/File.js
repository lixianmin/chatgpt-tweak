/********************************************************************
 created:    2022-04-26
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

export function readAllText(filepath) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function() {
      const text = reader.result;
      resolve(text);
    };

    reader.readAsText(filepath);
  });
}