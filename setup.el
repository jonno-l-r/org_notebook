;; -*- lexical-binding: t;-*-
(defconst org-notebook-dir (file-name-directory load-file-name))

(let
    ((index-template (f-read-text (expand-file-name "templates/index.org" org-notebook-dir) 'iso-latin-1-dos))
     (entry-template (f-read-text (expand-file-name "templates/entry.org" org-notebook-dir) 'iso-latin-1-dos))
     (tag-template (f-read-text (expand-file-name "templates/tag.org" org-notebook-dir) 'iso-latin-1-dos)))

  
  (defun string-replace-n (vals-alist string)
    (dolist (var vals-alist string)
      (setq string
            (string-replace
             (car var)
             (let ((value (plist-get (cdr var) :value))
                   (format (plist-get (cdr var) :format))
                   (func (plist-get (cdr var) :func)))
               (format (if format format "%s") (if func (funcall func value) value)))
             string))))


  (defun org-notebook-format-tag (tag)
    (string-replace-n `(("{{tag}}" :value ,tag)) tag-template))


  (defun org-notebook-entry-format (entry style project)
    (cond ((not (directory-name-p entry))
           (string-replace-n `(("{{timestamp}}"
                                :value ,(org-publish-find-date entry project)
                                :func (lambda (tstring) (format-time-string "%Y-%m-%d" tstring)))
                               ("{{name}}" :value ,(org-publish-find-title entry project))
                               ("{{link}}" :value ,entry)
                               ("{{tags}}"
                                :value ,(org-publish-find-property entry :filetags project)
                                :func (lambda (taglist)
                                        (mapconcat 'org-notebook-format-tag taglist " "))))
                             entry-template))
          
	  ((eq style 'tree)
	   ;; Return only last subdir.
	   (file-name-nondirectory (directory-file-name entry)))
	  (t entry)))


  (defun org-notebook-sitemap (title list)
    (string-replace-n `(("{{index-title}}" :value ,title)
                        ("{{index-content}}" :value
                         ,(org-list-to-generic
                           list '(:ifmt
                                  (lambda (type contents)
                                    (concat (string-replace-n
                                             `(("{{html}}" :value "@@html:")
                                               ("{{/html}}" :value "@@"))
                                             contents) "\n\n"))))))
                      index-template)))


(setq org-publish-project-alist
      `(("static"
         :base-directory "~/Documents/projects/org_notebook/static"
         :base-extension "css\\|js"
         :publishing-directory ,(expand-file-name "published/static" org-notebook-dir)
         :recursive t
         :publishing-function org-publish-attachment)

        ("media"
         :base-directory "~/Documents/projects/org_notebook/examples"
         :base-extension "png\\|jpg\\|jpeg\\|pdf"
         :publishing-directory ,(expand-file-name "published" org-notebook-dir)
         :recursive t
         :publishing-function org-publish-attachment)
        
        ("org"
         :base-directory "~/Documents/projects/org_notebook/examples"
         :base-extension "org"
         :publishing-directory ,(expand-file-name "published" org-notebook-dir)
         :recursive t
         :publishing-function org-html-publish-to-html
         :auto-sitemap t
         :sitemap-style list
         :sitemap-title "Project Journal"
         :with-author t
         :with-date t
         :sitemap-sort-files anti-chronologically
         :sitemap-format-entry org-notebook-entry-format
         :sitemap-function org-notebook-sitemap)

        ("org-notebook-site" :components ("org" "media" "static"))))



