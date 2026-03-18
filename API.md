# 📂 File Manager API

A simple **File Manager API**.  
It allows creating, uploading, downloading, moving, renaming, and deleting files and folders.

---

## 🌍 Base URL

```
http://localhost:3001/api
```

---

## 📑 Endpoints

### 1. 🔍 Retrieve items

**GET** `/api/items`

- **Description**: Returns all files and folders.
- **Query params (optional)**:
  - `parentId`: Parent folder ID (if not set = root).
- **Response (200)**:

```json
{
	"items": [
		{
			"id": "1694512345676",
			"parentId": null,
			"name": "Documents",
			"folder": true,
			"creation": "2025-09-13T09:39:22.304Z",
			"modification": "2025-09-13T09:39:22.304Z"
		}
	]
}
```

---

### 2. ➕ Create folder or multiple files

**POST** `/api/items`

#### Case 1: Create folder or multiple files (JSON)

- **Body (application/json)**:

```json
{
	"name": "New Folder",
	"folder": true
}
```

- **Response (201)**:

```json
{
	"id": "1694512345678",
	"parentId": null,
	"name": "New Folder",
	"folder": true,
	"creation": "2025-09-13T09:39:22.304Z",
	"modification": "2025-09-13T09:39:22.304Z"
}
```

#### Case 2: Upload a multiple files (FormData)

- **Body (multipart/form-data)**:
  - Field `files` → binary files
  - Field `parentId` // optional

- **Response (201)**:

```json
{
	"id": "1694512345679",
	"parentId": null,
	"name": "photo.png",
	"folder": false,
	"creation": "2025-09-13T09:39:22.304Z",
	"modification": "2025-09-13T09:39:22.304Z",
	"filePath": "uploads/abc123",
	"mimeType": "image/png",
	"size": 9195
}
```

- **Response (409)**: (Conflit)

```
{
  "code": "DUPLICATE_FOLDER",
  "desc": "A folder with this name already exists in this location"
}

```

```
{
  "code": "DUPLICATE",
  "desc": "A file with this name already exists in this location"
}

```

- **Response (413)**: (Payload Too Large)

```
{
  "code": "FILESIZE_LIMIT_EXCEEDED",
  "desc": "File size exceeds the 10MB limit"
}

```

- **Response (500)**:

```
{
  "code": "SERVER_ERROR",
  "desc": "Internal server error while processing request"
}
```

---

### 3. ⬇️ Download file

**GET** `/api/items/{itemId}`

- **Description**: Downloads the file with the given `itemId`.
- **Parameters**:
  - `itemId`: ID of the item.
- **Response (200)**: Binary file.
- **Example**:

```bash
curl -O http://localhost:3000/api/items/1694512345679
```

---

### 4. 🗑️ Delete item

**DELETE** `/api/items/{itemId}`

- **Description**: Deletes a file or folder (and its subtree).
- **Parameters**:
  - `itemId`: ID of the item.
- **Response (204)**: No content if success.
- **Response (404)**:

```json
{
	"code": "NOT_FOUND",
	"desc": "Item not found"
}
```

---

### 5. ✏️ Move or rename item

**PATCH** `/api/items/{itemId}`

- **Description**: Move to another folder (`parentId`) or rename (`name`).
- **Body (application/json)**:

```json
{
	"parentId": "12345", // optional
	"name": "newname.jpg" // optional
}
```

- **Response (200)**:

```json
{
	"id": "1694512345679",
	"parentId": "12345",
	"name": "newname.jpg",
	"folder": false,
	"creation": "2025-09-13T09:39:22.304Z",
	"modification": "2025-09-13T10:12:00.000Z"
}
```

---

### 6. 📂 Retrieve item path

**GET** `/api/items/{itemId}/path`

- **Description**: Returns the full hierarchy (path) to the item.
- **Response (200)**:

```json
{
	"items": [
		{ "id": "root", "name": "Root", "folder": true },
		{ "id": "123", "name": "Documents", "folder": true },
		{ "id": "1694512345679", "name": "newname.jpg", "folder": false }
	]
}
```

- **Response (404)**:

```json
{
	"code": "NOT_FOUND",
	"desc": "Item not found"
}
```

---

## 🗄️ Data Schema (Item)

```json
{
	"id": "string",
	"parentId": "string | null",
	"name": "string",
	"folder": true,
	"creation": "date-time",
	"modification": "date-time",
	"filePath": "string (optional, if files)",
	"mimeType": "string (optional, if files",
	"size": "number (optional, if file)"
}
```

---

## ⚙️ Installation and Start

```bash
# Install dependencies
npm install

# Start server
node server.js
```

API available at: [http://localhost:3001/api](http://localhost:3001/api)
