export const paginate = ({ pageNo, pageSize}) => {
  pageNo = pageNo ? parseInt(pageNo) : 0
  pageSize = pageSize ? parseInt(pageSize) : 10
    
  if (isNaN(pageNo))
    pageNo = 0
  else if (pageNo<0)
    pageNo = 0

  if (pageNo===0)
    pageNo = 1
    
  if (isNaN(pageSize))
    pageSize = 10
  else if (pageSize<=0)
    pageSize = 10
    
  const offset = (pageNo - 1) * pageSize
  const limit = pageSize
    
  return {
    offset,
    limit
  }
}