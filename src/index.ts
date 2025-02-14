import {
  createWriteStream,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from "fs";
import path from "path";
import archiver from "archiver";

export const convertToSankhyaBI = () => {
  return {
    name: "transform-html",
    transformIndexHtml(html: string) {
      let transformedHtml = html.replace(
        "<!doctype html>",
        `<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="UTF-8" isELIgnored ="false"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page import="java.util.*" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<%@ taglib prefix="snk" uri="/WEB-INF/tld/sankhyaUtil.tld" %>`
      );

      transformedHtml = transformedHtml.replace(
        "</head>",
        `  <snk:load/>
    <script>
      window.resolveAsset = (url) => "\${BASE_FOLDER}" + url;
    </script>
  </head>`
      );

      transformedHtml = transformedHtml.replace(
        /<script[^>]+src="([^"]+)"/g,
        (match, src) => {
          if (src.startsWith("/")) {
            return `<script type="module" crossorigin src="${"${BASE_FOLDER}"}${src.replace(
              /\//,
              ""
            )}"`;
          }
          return match;
        }
      );

      transformedHtml = transformedHtml.replace(
        /<link[^>]+href="([^"]+)"/g,
        (match, href) => {
          if (href.startsWith("/")) {
            return `<link rel="stylesheet" crossorigin href="${"${BASE_FOLDER}"}${href.replace(
              /\//,
              ""
            )}"`;
          }
          return match;
        }
      );

      return transformedHtml;
    },
    writeBundle(options: { dir?: string }) {
      const distDir = options.dir || "dist";

      const jsFiles = getJsFiles(distDir);

      jsFiles.forEach((path) => {
        const fileContent = readFileSync(path, "utf-8");

        const transformedContent = fileContent.replace(
          /(['"])([^'"]+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico))\1/g,
          (src) => `window.resolveAsset(${src})`
        );

        writeFileSync(path, transformedContent, "utf-8");
      });

      const outputPath = path.join(distDir, "..", "build.zip");

      const output = createWriteStream(outputPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.pipe(output);

      renameSync(`${distDir}/index.html`, `${distDir}/index.jsp`);

      archive.directory(distDir, false);

      archive.finalize();
    },
  };
};

function getJsFiles(dir: string, fileList: string[] = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getJsFiles(filePath, fileList);
    } else if (file.endsWith(".js")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}
