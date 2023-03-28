"use strict";

import moment from "moment";

/********************************************************************
 created:    2023-03-27
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/


export function formatDateTime(dateTime) {
  const format = "YYYY-MM-DD HH:mm:ss";
  return moment(dateTime).format(format);
}