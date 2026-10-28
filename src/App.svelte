<script>
  import "./app.css";
  import Navbar from "$lib/Navbar.svelte";
  import { ModeWatcher } from "mode-watcher";
</script>

<div>
  <ModeWatcher />
  <Navbar />
</div>
