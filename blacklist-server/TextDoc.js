function TextDoc(uri, languageId, version, content) {
  this.uri = uri
  this.languageId = languageId
  this.setContent(content, version)
}

TextDoc.prototype.setContent = function (content, version) {
  this.content = content
  this.lineCount = content.split('\n').length
  this.version = version
}

TextDoc.prototype.getText = function (range) {
  if (range) {
    throw new Error('not implemented')
  }
  return this.content
}

TextDoc.prototype.positionAt = function (offset) {
  const snippet = this.content.substr(0, offset)
  const lines = snippet.split('\n')
  const lastNewLine = snippet.lastIndexOf('\n')
  const character = lastNewLine > -1
    ? offset - lastNewLine - (lines.length > 1 ? 1 : 0)
    : offset
  return {
    line: lines.length - 1,
    character,
  }
}

TextDoc.prototype.offsetAt = function (position) {
  throw new Error('not implemented')
}

module.exports = TextDoc
