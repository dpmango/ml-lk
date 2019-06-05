const apiParamsRouter = (params, method) => {
  let paramsRouter = {};
  if (method === 'post') {
    paramsRouter = params;
  } else if (method === 'delete') {
    paramsRouter = {
      data: params,
    };
  } else if (method === 'get') {
    paramsRouter = {
      params,
    };
  } else {
    paramsRouter = params;
  }

  return paramsRouter;
};

export default apiParamsRouter;
