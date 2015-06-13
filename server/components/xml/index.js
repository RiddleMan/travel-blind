var child_process = require('child_process');
var os = require('os');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

function exec(cmd, options) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, options, function(err, stdout, stderr) {
      if(err)
        return reject(err);

      resolve({
        stdout: stdout,
        stderr: stderr
      });
    })
  });
}

class XmlActions {
  getTmpPath(xml) {
    var hash;
    var hashFunc = crypto.createHash('sha1');
    hashFunc.update(xml);
    hash = hashFunc.digest('hex');

    return path.join(os.tmpdir(), `${hash}.xml`);
  }

  saveXml(xml, path) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, xml, err => {
        if(err)
          return reject(err);
        resolve();
      })
    });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if(err)
          return reject(err);

        resolve();
      });
    });
  }

  checkValidation(resp) {
    var regex = /validates\n$/;

    return regex.test(resp.stderr);
  }

  transform(xml) {
    var transformFileName = 'mapsTransform.xslt';
    var tmpPath = this.getTmpPath(xml);

    return this.saveXml(xml, tmpPath)
      .then(() => exec(`xsltproc ${transformFileName} ${tmpPath}`,{
        cwd: __dirname
      }))
      .then((resp) => {
        this.delete(tmpPath);
        return resp;
      })
  }

  validate(xml) {
    var schemaFileName = 'requestSchema.xsd';
    var tmpPath = this.getTmpPath(xml);

    return this.saveXml(xml, tmpPath)
      .then(() => exec(`xmllint ${tmpPath} --noout --schema ${schemaFileName}`, {
        cwd: __dirname
      }))
      .then((resp) => {
        this.delete(tmpPath);
        return resp;
      })
      .then(() => true)
      .catch(() => false);
  }
}

module.exports = new XmlActions();
