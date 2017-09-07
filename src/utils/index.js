const sortBy = (items, key, asc) => {
  return [...items.sort((item, itemNext) => {
    if (asc) {
      return item[key] - itemNext[key]
    }
    return itemNext[key] - item[key]
  })]
}

export default sortBy