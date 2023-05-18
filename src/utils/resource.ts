export const getResourceUrl = (resource: Resource, withOrigin = true) => {
  if (resource.externalLink) {
    return resource.externalLink;
  }
  return `https://memosapi.dingjunjie.com/o/r/${resource.id}/${resource.filename}`;
};
