<script>
	import '../app.css';
</script>

<body class="h-screen w-screen font-sans antialiased text-white bg-fixed bg-gradient-to-br from-black to-gray-800">
    <section>
        <header class="flex justify-center">
            <nav class="flex justify-around w-2/3 p-6 ">
                <a href="/" class="hover:text-gray-400">Home</a>
                <a href="/about" class="hover:text-gray-400">About</a>
                <a href="/location" class="hover:text-gray-400">Location</a>
            </nav>
        </header>
    </section>
	<slot />
</body>
