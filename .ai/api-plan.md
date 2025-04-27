# REST API Plan

## 1. Resources

- **Users**: Corresponds to the `users` table (managed through Supabase Auth). Manages user registration, authentication, and profile details.
- **Flashcards**: Corresponds to the `flashcards` table. Handles both AI-generated and manually created flashcards.
- **Generations**: Corresponds to the `generations` table. Tracks AI-powered flashcard generation requests, including metadata like flashcards count and source text.
- **Generation Error Logs**: Corresponds to the `generation_error_logs` table. Logs errors encountered during the flashcard generation process.

## 2. Endpoints

### 2.2. Flashcards

- **GET /flashcards**
  - **Description**: Retrieve a paginated list of flashcards belonging to the authenticated user.
  - **Query Parameters**: 
    - `page` (number, default: 1): Page number.
    - `limit` (number, default: 10): Number of records per page.
    - `sort_by` (optional): Field to sort (e.g., created_at).
    - `order` (optional): 'asc' or 'desc'.
  - **Response Payload**:
    ```json
    {
      "flashcards": [
        {
          "id": "uuid",
          "front_text": "Example question",
          "back_text": "Example answer",
          "source": "manual | ai-full | ai-edited",
          "generation_id": "uuid or null",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50
      }
    }
    ```
  - **Success Codes**: 200 OK.
  - **Error Codes**: 401 Unauthorized.

- **POST /flashcards**
  - **Description**: Create multiple flashcards in a single request (manual or accepted AI suggestions).
  - **Request Payload**:
    ```json
    {
      "flashcards": [
        {
          "front_text": "What is the capital of France?",
          "back_text": "Paris",
          "source": "manual",
          "generation_id": "optional uuid if AI-generated"
        },
        {
          "front_text": "What is the capital of Germany?",
          "back_text": "Berlin",
          "source": "manual",
          "generation_id": "optional uuid if AI-generated"
        }
      ]
    }
    ```
  - **Response Payload**:
    ```json
    {
      "flashcards": [
        {
          "id": "uuid",
          "front_text": "What is the capital of France?",
          "back_text": "Paris",
          "source": "manual",
          "generation_id": "uuid or null",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        },
        {
          "id": "uuid",
          "front_text": "What is the capital of Germany?",
          "back_text": "Berlin",
          "source": "manual",
          "generation_id": "uuid or null",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ],
      "success_count": 2,
      "error_count": 0
    }
    ```
  - **Success Codes**: 201 Created.
  - **Error Codes**: 400 Bad Request (validation errors), 401 Unauthorized.

- **GET /flashcards/{id}**
  - **Description**: Retrieve details of a single flashcard.
  - **Response Payload**: Similar to POST response payload.
  - **Success Codes**: 200 OK.
  - **Error Codes**: 404 Not Found, 401 Unauthorized.

- **PUT /flashcards/{id}**
  - **Description**: Update an existing flashcard.
  - **Request Payload** (only updatable fields):
    ```json
    {
      "front_text": "Updated question text",
      "back_text": "Updated answer",
      "source": "manual | ai-full | ai-edited"
    }
    ```
  - **Response Payload**: The updated flashcard object.
  - **Success Codes**: 200 OK.
  - **Error Codes**: 400 Bad Request, 404 Not Found, 401 Unauthorized.

- **DELETE /flashcards/{id}**
  - **Description**: Delete a flashcard.
  - **Success Codes**: 200 OK with confirmation message.
  - **Error Codes**: 404 Not Found, 401 Unauthorized.

### 2.3. Generations

- **POST /generations**
  - **Description**: Initiate an AI-powered flashcard suggestions generation request. Validates the input text length (between 1000 and 10000 characters) and calls the external LLM API.
  - **Request Payload**:
    ```json
    {
      "source_text": "Paste text here between 1000 and 10000 characters..."
    }
    ```
  - **Response Payload**:
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "model": "selected-llm-model",
      "duration": 1234,
      "flashcards_count": 5,
      "flashcard_suggestions": [
        {"front_text": "...", "back_text": "...", "source": "ai-full"}
      ]
    }
    ```
  - **Success Codes**: 201 Created.
  - **Error Codes**: 400 Bad Request (e.g., source_text length validation), 500 Internal Server Error if external API fails, 401 Unauthorized.

- **GET /generations**
  - **Description**: Retrieve a list of generation histories for the authenticated user with pagination.
  - **Query Parameters**: `page`, `limit`, `sort_by`, `order`.
  - **Response Payload**: List of generation objects along with pagination info.
  - **Success Codes**: 200 OK.
  - **Error Codes**: 401 Unauthorized.

- **GET /generations/{id}**
  - **Description**: Retrieve details of a specific generation request, including generated flashcard suggestions.
  - **Success Codes**: 200 OK.
  - **Error Codes**: 404 Not Found, 401 Unauthorized.

### 2.4. Generation Error Logs

- **GET /generation-error-logs**
  - **Description**: Retrieve error logs related to flashcard generation for the authenticated user.
  - **Response Payload**:
    ```json
    {
      "error_logs": [
        {
          "id": "uuid",
          "model": "llm-model",
          "source_text": "...",
          "error_code": "error-code",
          "error_message": "detailed error message",
          "created_at": "timestamp"
        }
      ]
    }
    ```
  - **Success Codes**: 200 OK.
  - **Error Codes**: 401 Unauthorized.


## 3. Authentication and Authorization

- **Mechanism**: The API utilizes token-based authentication via Supabase Auth. 
  - Upon successful login, a JWT token is returned which must be included in the `Authorization` header (`Bearer <token>`) for all subsequent requests.
  - Row-Level Security (RLS) policies in the database ensure that users can only access records where `user_id` matches the authenticated user's ID (i.e., using `auth.uid() = user_id`).
  - Endpoints `/auth/register` and `/auth/login` are public, while all other endpoints require authentication.

## 4. Validation and Business Logic

### 4.1. Validation Conditions

- **Users**:
  - Email must be in a valid format and unique.
  - Password must meet defined security requirements (e.g., minimum length).
- **Flashcards**:
  - `front_text`: Must not exceed 200 characters.
  - `back_text`: Must not exceed 500 characters.
  - `source`: Must be one of: `ai-full`, `ai-edited`, or `manual`.
- **Generations**:
  - `source_text`: Must be between 1000 and 10000 characters.

### 4.2. Business Logic Implementation

- **AI-Powered Flashcard Suggestions Generation**:
  - Validates input text length before initiating a generation request.
  - Calls an external LLM API (via Openrouter.ai) to generate flashcard suggestions.
  - Stores generation metadata (e.g., flashcards_count, duration) along with suggestions in the `generations` table.
  - Captures and logs any errors that occur during generation (e.g., API failures, parsing issues) in the `generation_error_logs` table with error codes, detailed error messages, and the source text that caused the error.

- **Flashcard Management**:
  - Users can review, accept, edit, or reject generated flashcards.
  - Accepted flashcards can be manually or automatically added to the `flashcards` table.
  - Automatic update of `updated_at` fields via triggers when a flashcard is modified.
