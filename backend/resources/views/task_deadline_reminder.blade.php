<h2>⏰ Nhắc nhở deadline cho công việc</h2>
<p><strong>Task:</strong> {{ $task->title }}</p>
<p><strong>Deadline:</strong> {{ $task->deadline }}</p>
<p><strong>Trạng thái:</strong> {{ $task->status }}</p>
<p>Hãy hoàn thành task đúng hạn nhé! 🔥</p>
<p>Truy cập vào <a href="{{ route('tasks.show', $task->id) }}">đường dẫn này</a> để xem chi tiết.</p>
<p>Chúc bạn làm việc hiệu quả! 💪</p>