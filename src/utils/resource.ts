export const getResourceUrl = (resource: Resource, withOrigin = true) => {
  if (resource.externalLink) {
    return resource.externalLink;
  }
  return `http://127.0.0.1:9090/o/r/${resource.id}/${resource.filename}`;
};
