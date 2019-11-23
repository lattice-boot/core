export function join(...paths: string[]) {
  const uri = paths.reduce((result, current) => `${result}/${current}`, '/');
  return clean(uri);
}

export function clean(uri: string) {
  uri = uri.replace(/(\/)\1+/g, '\/');
  uri = uri[0] == '\/' ? uri : '\/' + uri;
  uri = uri[uri.length - 1] == '\/' ? uri.substring(0, uri.length - 1) : uri;
  return uri;
} 
