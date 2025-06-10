
@php
  $manifest = json_decode(file_get_contents(public_path('build/.vite/manifest.json')), true);
  $entry = $manifest['src/main.tsx']; // 👈 PHẢI KHỚP VỚI input trong vite.config.ts
@endphp

@if (isset($entry['css']))
  <link rel="stylesheet" href="{{ asset('build/' . $entry['css'][0]) }}">
@endif

<div id="root"></div>

<script type="module" src="{{ asset('build/' . $entry['file']) }}"></script>
