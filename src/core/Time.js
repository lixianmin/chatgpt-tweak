"use strict";

import moment from "moment";

/********************************************************************
 created:    2023-03-28
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/


export function formatDateTime(dateTime) {
  const format = "YYYY-MM-DD HH:mm:ss";
  if (typeof dateTime === "string") {
    return moment.unix(dateTime).format(format);
  } else {
    return moment(dateTime).format(format);
  }
}