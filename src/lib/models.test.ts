import { describe, it, expect } from 'vitest'

// Test the JSON parsing helper logic used in models.ts
function parseJsonField(value: string): string[] {
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

describe('parseJsonField', () => {
  it('parses valid JSON array', () => {
    const result = parseJsonField('["a","b","c"]')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('returns empty array for invalid JSON', () => {
    const result = parseJsonField('not json')
    expect(result).toEqual([])
  })

  it('returns empty array for empty string', () => {
    const result = parseJsonField('')
    expect(result).toEqual([])
  })

  it('handles empty JSON array', () => {
    const result = parseJsonField('[]')
    expect(result).toEqual([])
  })
})

describe('Model slug generation', () => {
  function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }

  it('generates slug from English name', () => {
    expect(generateSlug('NeuralChat-X')).toBe('neuralchat-x')
  })

  it('generates slug with multiple words', () => {
    expect(generateSlug('My Cool Model')).toBe('my-cool-model')
  })

  it('handles special characters', () => {
    expect(generateSlug('Model@v2.0!')).toBe('model-v2-0-')
  })
})

describe('API key generation', () => {
  function generateRandomKey(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  it('generates key of correct length', () => {
    const key = generateRandomKey(32)
    expect(key).toHaveLength(32)
  })

  it('generates unique keys', () => {
    const key1 = generateRandomKey(32)
    const key2 = generateRandomKey(32)
    expect(key1).not.toBe(key2)
  })

  it('contains only valid characters', () => {
    const key = generateRandomKey(100)
    expect(key).toMatch(/^[a-z0-9]+$/)
  })
})
