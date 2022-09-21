<script lang="ts">
  import { getSearchParams, initializeSearchParamsContext } from "$lib/reactiveSearchParams";
  initializeSearchParamsContext()
  const searchParams = getSearchParams()
</script>

<h1>Welcome to moonmoon library project</h1>
<div>
  <h2>Example</h2>
  <div>
    <p>type here. you can see change on your url</p>
    <input bind:value={$searchParams.search}/>
  </div>
</div>
