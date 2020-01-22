#!/usr/bin/env node

const {
  DiagnosticSeverity,
  TextDocuments,
  createConnection,
} = require('vscode-languageserver')

const TextDoc = require('./TextDoc')

const getBlacklisted = (text) => {
  const blacklist = [
    'foo',
    'bar',
    'baz',
  ]
  const regex = new RegExp(`\\b(${blacklist.join('|')})\\b`, 'gi')
  const results = []
  regex.lastIndex = 0
  while ((matches = regex.exec(text)) && results.length < 100) {
    results.push({
      value: matches[0],
      index: matches.index,
    })
  }
  return results
}

const blacklistToDiagnostic = (textDocument) => ({ index, value }) => ({
  severity: DiagnosticSeverity.Warning,
  range: {
    start: textDocument.positionAt(index),
    end: textDocument.positionAt(index + value.length),
  },
  message: `${value} is blacklisted.`,
  source: 'Blacklister',
})

const getDiagnostics = (textDocument) =>
  getBlacklisted(textDocument.getText())
    .map(blacklistToDiagnostic(textDocument))

const connection = createConnection()

const docsConfig = {
  create(uri, languageId, version, content) {
    return new TextDoc(uri, languageId, version, content)
  },
  update(document, changes, version) {
    if (document) {
      changes.forEach((change) => {
        const { text } = change
        document.setContent(text, version)
      })
    }
    return document
  }
}

const documents = new TextDocuments(docsConfig)

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: documents.syncKind,
  },
}))

documents.onDidChangeContent(change => {
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: getDiagnostics(change.document),
  })
})

documents.listen(connection)
connection.listen()
