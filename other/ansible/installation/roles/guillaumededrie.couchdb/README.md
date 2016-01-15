# CouchDB role - Ansible


## Requirements

Tested for Ansible 1.4 and higher. Even if it has **been developed for Debian
systems, it is assumed to work on Ubuntu as well**.


## Roadmap

- [x] Resolve idempotent problems
- [x] Release v1.0.0, first stable version
- [ ] Add possibility to configure CouchDB (`local.ini` file)


## Dependencies

This role needs a pre-installed Erlang and build-essential. Ansbile roles
for that are for example:

- [Ansibles.erlang](https://github.com/Ansibles/erlang)
- [Ansibles.build-essential](https://github.com/Ansibles/build-essential)

But feel free to use other ways for getting these pre-requirements
installed.

## Installation

```
$ ansible-galaxy install guillaumededrie.couchdb
```

## Variables

### Role installation

```yaml
couchdb_version: "1.5.0"
couchdb_version_installed: 0 # used to compare requested with installed version
couchdb_install_method: "source" # can be "package" or "source"
```


### Source installation parameters

```yaml
couchdb_file_tag: ...
couchdb_file_name: ...
couchdb_base_url: ...
couchdb_tarball_url: ...
couchdb_shasum_url: ...
couchdb_tmp_dir: ...
```


## License

License under GPLv3. See the LICENSE file for details.
