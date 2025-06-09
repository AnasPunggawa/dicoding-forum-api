/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('like_comments', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      referencesConstraintName: 'like_comments_comment_id_fkey',
      references: 'comments(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      referencesConstraintName: 'like_comments_user_id_fkey',
      references: 'users(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint(
    'like_comments',
    'like_comments_comment_id_user_id_key',
    'UNIQUE(comment_id, user_id)'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('like_comments', 'like_comments_comment_id_user_id_key');
  pgm.dropTable('like_comments');
};
