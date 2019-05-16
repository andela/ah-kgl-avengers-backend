export default {
  /**
   * PostgreSQL function(trigger) written in PL/pgSQL
   * The trigger will run after updating a comment
   * It will add the old records into a new record in the CommentEdits table
   */
  afterCommentUpdate: `
        create or replace function trigger_on_comment_edits()
            returns trigger as $body$
        begin
            -- Create comment update only if the comment body has been changed
            if old.body <> new.body or old."highlightedText" <> new."highlightedText" then
                insert into "CommentEdits" ("commentId", body, "highlightedText", "startIndex", "endIndex", "createdAt")
                values (old.id, old.body, old."highlightedText", old."startIndex", old."endIndex", old."updatedAt");
            end if;
            -- return the new record so that update can carry on as usual
            return new;
        end; 
        $body$ language plpgsql;

        create trigger trigger_on_comment_edits
            before update
            on "Comments"
            for each row
        execute procedure trigger_on_comment_edits();
    `
};
