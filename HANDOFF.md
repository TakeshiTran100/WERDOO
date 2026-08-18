# WERDOO — DEVELOPMENT HANDOFF

## 1. PROJECT GOAL

WERDOO là web viết truyện cá nhân, chỉ dùng bởi tôi và người yêu.
Mục tiêu hiện tại: hoàn thiện MVP dùng được ngay cho anniversary.
Deadline rất gấp.
Ưu tiên chức năng cốt lõi, bỏ qua tính năng phụ.

Đã thống nhất:
- Bỏ qua Workflow.
- Bỏ qua Moodboard.
- Bỏ qua các tính năng chưa cần thiết.
- Không refactor lớn.
- Ưu tiên sửa nhỏ, an toàn.
- Sau anniversary mới mở rộng.

## 2. DEVELOPMENT RULES

Claude tiếp theo phải:
- Audit trước khi sửa nếu chưa rõ code path.
- Không rewrite toàn bộ file.
- Ưu tiên Find → Replace từng đoạn nhỏ.
- Mỗi task chia thành các checkpoint.
- Không tự ý mở rộng scope.
- Không sửa database nếu chưa xác định nguyên nhân.
- Không sửa store.js nếu không thật sự cần.
- Sau mỗi task phải test trước khi sang task tiếp theo.
- Không lặp lại những task đã PASS bên dưới.

## 3. CURRENT ARCHITECTURE

Frontend:
- React
- Zustand
- Tiptap
- Framer Motion
- Supabase
- Vite

Auth:
- Supabase Auth
- Login/Signup/Logout hoạt động.

Data:
- Supabase là persistent database.
- Zustand/localStorage vẫn tồn tại như frontend state/cache.
- Không coi localStorage là nguồn dữ liệu lâu dài.

## 4. SUPABASE CURRENT SCHEMA

public.stories hiện có:

- id uuid
- user_id uuid
- title text
- description text
- category text
- status text
- cover_image text
- color text
- tags text[]
- content text
- chapter_title text
- word_count integer
- chapters integer
- created_at timestamptz
- updated_at timestamptz

Các bảng khác đã tồn tại từ schema ban đầu:
- chapters
- worlds
- characters
- notes
- moodboard_collections
- workflow_data

KHÔNG tự xóa các bảng này.

RLS đã bật.
stories có policy giới hạn user theo auth.uid() = user_id.

## 5. IMPORTANT MVP DATA MODEL

Hiện tại MVP KHÔNG dùng hệ thống Chapters thật.

Quy ước hiện tại:

currentStory.title
= tên CUỐN TRUYỆN
→ stories.title

chapterTitle trong Write.jsx
= tiêu đề ở đầu trang viết
→ stories.chapter_title

content
→ stories.content

wordCount
→ stories.word_count

chapters
→ hiện chỉ là số, MVP giữ tối đa 1 và không tăng mỗi lần Save.

Không được trộn:
- Story title
- Writing/Chapter title

## 6. COMPLETED TASKS

### Task 01 — Supabase schema + RLS
PASS.

### Task 02 — READ stories
PASS.

App.jsx load stories bằng:
getStories(session.user.id)

Library đọc stories từ Zustand.

### Task 03 — CREATE Story
PASS.

Library Create Story:
- createStory()
- INSERT Supabase
- UUID thật từ Supabase
- setStories() cập nhật Zustand
- không dùng addStory() cho Library Create.

### Task 04 — SAVE Story
PASS.

Write.jsx:
- Save gọi updateStoryInSupabase()
- content được UPDATE Supabase
- metadata được UPDATE
- không reset editor sau Save
- F5 vẫn giữ content.

### Task 04B — Story title / writing title
PASS.

Đã sửa:
- chapterTitle khởi tạo từ currentStory.chapterTitle
- stories.title lấy currentStory.title
- stories.chapter_title lấy chapterTitle
- không reset chapterTitle sau Save
- không dùng draftTitle nữa.

Đã test:
- Save
- Supabase record
- F5
- rời Write → vào lại
- Save lần 2

Đều PASS.

## 7. IMPORTANT FILES

Các file đã thay đổi/quan trọng:

src/App.jsx
src/store.js
src/services/storyService.js
src/components/pages/Library.jsx
src/components/pages/Write.jsx

Không assume code hiện tại giống code cũ.
Nếu cần kiểm tra implementation, đọc file hiện tại trong repo.

## 8. GIT CHECKPOINT

Các thay đổi đã được commit/push lên GitHub.

Trước khi làm task mới:
- kiểm tra git status
- kiểm tra branch
- không reset/rebase/force push.
- không xóa commit cũ.

## 9. CURRENT NEXT TASK

Task tiếp theo chưa hoàn thành:

TASK 05 — UPDATE / DELETE / MVP STABILITY

Claude mới phải:
1. Đọc code hiện tại.
2. Audit các luồng Update/Delete hiện có.
3. Xác định chúng còn ghi localStorage hay đã ghi Supabase.
4. Chưa sửa code ngay.
5. Báo cáo:
   A. Current behavior
   B. Files/functions involved
   C. Supabase operations needed
   D. Minimal changes
6. Chờ xác nhận trước khi đưa Find → Replace.

Ưu tiên:
- Update Story metadata
- Delete Story
- đảm bảo F5/login vẫn đúng
- RLS/user isolation
- không làm Workflow/Moodboard.

## 10. KNOWN NON-MVP ISSUE

Home.jsx → Write vẫn có nhánh tạo Story chưa có UUID Supabase và còn dùng Date.now()/addStory().

Đã cố tình để ngoài scope MVP trước anniversary.

KHÔNG tự sửa trừ khi Task 05 chứng minh nó ảnh hưởng trực tiếp đến MVP.

## 11. DO NOT REDO

Không làm lại:
- Supabase Auth
- stories schema
- RLS
- getStories()
- Library Create Story
- Write Save Content
- Story title/chapter title fix

Tất cả đã PASS.

## 12. HANDOFF INSTRUCTION

Claude mới đọc file này trước.

Sau đó kiểm tra git status.

Sau đó chỉ bắt đầu TASK 05.

Không audit toàn bộ project lại nếu không cần thiết.
Không hỏi lại những thông tin đã có trong file này.

Nếu phát hiện mâu thuẫn giữa HANDOFF.md và code thực tế:
- ưu tiên code thực tế,
- báo cáo mâu thuẫn,
- không tự sửa ngay.

Khi bắt đầu Task 05, chỉ AUDIT trước, chưa code.
