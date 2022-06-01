<script>
	import { Link } from "svelte-navigator";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
</script>


<header>
  <h1>History</h1>

  <nav>
    <button title="Go back" on:click={() => navigate(-1)}>&lt;-</button>
    <button title="Go forward" on:click={() => navigate(1)}>-&gt;</button>
    <Link to="/">Base</Link>
    <Link to="home">Home</Link>
    <Link to="about">About</Link>
  </nav>
</header>