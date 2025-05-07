# Generations API

## POST /generations

Creates a new flashcard generation request from provided text input.

### Request

```http
POST /generations
Content-Type: application/json

{
  "source_text": "Your text content here..."
}
```

#### Request Body Parameters

| Parameter    | Type   | Required | Description                                                |
|-------------|--------|----------|------------------------------------------------------------|
| source_text | string | Yes      | The text to generate flashcards from (1000-10000 chars)    |

### Response

#### Success Response (201 Created)

```json
{
  "id": "uuid",
  "flashcards_count": 1,
  "flashcard_suggestions": [
    {
      "front_text": "Question about the text...",
      "back_text": "Answer from the text...",
      "source": "ai-full"
    }
  ]
}
```

#### Response Fields

| Field                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| id                  | string   | Unique identifier for the generation             |
| flashcards_count    | number   | Number of flashcards generated                   |
| flashcard_suggestions| array    | Array of generated flashcard suggestions        |

##### Flashcard Suggestion Object

| Field      | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| front_text | string | The question or front side of the flashcard      |
| back_text  | string | The answer or back side of the flashcard         |
| source     | string | Source type: "ai-full", "ai-edited", or "manual" |

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid request body",
  "details": [
    {
      "code": "too_small",
      "minimum": 1000,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Text must be at least 1000 characters",
      "path": ["source_text"]
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### Implementation Details

- The endpoint uses zod for request validation
- Generation duration is measured and stored
- Errors during generation are logged to `generation_error_logs` table
- Currently using mock data generation (OpenRouter integration planned)

### Database Tables

#### generations
Stores metadata about each generation request:
- user_id
- model
- duration
- source_text
- flashcards_count
- accepted_edited_count
- accepted_unedited_count

#### generation_error_logs
Stores error information when generation fails:
- user_id
- model
- source_text
- error_code
- error_message

### Future Improvements

1. Integration with OpenRouter API for AI-powered generation
2. User authentication implementation
3. Rate limiting
4. Caching of common generations 