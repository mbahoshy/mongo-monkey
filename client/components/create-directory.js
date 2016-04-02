class File {
  constructor(file) {
    this.file = file;
    this.name = file.filename && file.filename.indexOf('/') !== -1 ? file.filename.split('/').pop() : file.filename;
    this.imageTypes = ['png', 'jpg', 'jpeg'];
    this.excelTypes = ['xls', 'xlsx'];
  }
  getFullName() {
    return this.file.filename;
  }
  getExt() {
    return this.name.split('.').pop();
  }
  getId() {
    return this.file._id;
  }
  getIconType() {
    const ext = this.getExt().toLowerCase();

    if (this.imageTypes.indexOf(ext) !== -1) {
      return 'file-image-o';
    }
    if (this.excelTypes.indexOf(ext) !== -1) {
      return 'file-excel-o';
    }
    return 'file-text';
  }
}
class Folder {
  constructor(folder, name, path) {
    this.name = name || '';
    this.dirs = folder ? [folder] : [];
    this.files = [];
    this.isFolder = true;
    this.path = path;
  }
  isFolder() {
    return true;
  }
  hasChildren() {
    return this.dirs.length !== 0;
  }
  hasFiles() {
    return this.files.length !== 0;
  }
  addFile(file) {
    this.files.push(file);
  }
  addDir(dir) {
    const test = this.dirs.find(x => x.name === dir.name);
    if (!test) {
      this.dirs.push(dir);
    }
  }
}

class Directory {
  constructor(files) {
    this.allFiles = files.map(v => new File(v));
    let root = new Folder(null, null, '/');
    for (let i = 0; i < files.length; i++) {
      root = this.walkFiles(files[i].filename, root, files[i]);
    }
    this.root = root;
  }
  walkFiles(name, directory, file, path = '') {
    if (!name) return false;
    const paths = name.split('/');
    if (paths.length === 1) {
      directory.addFile(new File(file));
      return directory;
    }

    const nextName = paths.splice(1).join('/');
    const nextPath = `${path}/${paths[0]}`;
    const existingDir = directory.dirs.find(x => x.name === paths[0]) ||
      new Folder(null, paths[0], nextPath);

    const nextFolder = this.walkFiles(nextName, existingDir, file, nextPath);

    directory.addDir(nextFolder);

    return directory;
  }
  findPath(path, dirs) {
    if (dirs.length === 0) {
      return null;
    }
    let nextDirs = [];

    for (let i = 0; i < dirs.length; i++) {
      if (dirs[i].path === path) {
        return dirs[i];
      }
      nextDirs = nextDirs.concat(dirs[i].dirs);
    }
    return this.findPath(path, nextDirs);
  }
  getFolder(path) {
    if (path === '/') return this.root;
    const folder = this.findPath(path, this.root.dirs);
    return folder;
  }
  getParent(path) {
    if (path === '/') return null;
    const pathParts = path.split('/');
    const parentPath = pathParts.splice(0, pathParts.length - 1).join('/');
    if (parentPath === '') return this.root;
    const parent = this.findPath(`${parentPath}`, this.root.dirs);
    return parent;
  }
}

export default Directory;
