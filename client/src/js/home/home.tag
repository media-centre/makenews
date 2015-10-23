<home>
    <h3>Welcome {username}</h3>
    <script>
        this.mixin('rg.router');
        this.router.add({
            name: 'home',
            url: 'home'
        });
        this.on('mount', function() {
            this.username = localStorage.getItem("user");
            this.router.go("home");
        });
        this.router.start();
    </script>
</home>