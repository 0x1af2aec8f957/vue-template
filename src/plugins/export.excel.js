export default function (sheetName, fields, dataSource) {
  // 列标题
  const link = document.createElement('a');

  const response = {
    header: `${Object.values(fields).map(field => field.label).join(',')}\n`,
    body: dataSource.reduce((acc, row, index) => `${acc}${
      Object.entries(fields).reduce((accumulator, [key, field]) => `${accumulator}${
        field.render ? field.render(row[key], index, row) : row[key]
      },\t`, '')
    }\n`, ''),
  };

  const uri = 'data:text/csv;charset=utf-8,\ufeff';/* 输出base64编码 */ // 数据URI前缀

  [link.href, link.download] = [uri + encodeURIComponent(Object.values(response).join('')), `${sheetName}.csv`];

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
