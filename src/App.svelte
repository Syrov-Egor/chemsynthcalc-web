<script>
  import "./app.css";
  import { ModeWatcher } from "mode-watcher";

  import Navbar from "$lib/Navbar.svelte";
  import InputGroup from "$lib/InputGroup.svelte";
</script>

<div>
  <ModeWatcher />
  <Navbar />
  <InputGroup />
</div>
