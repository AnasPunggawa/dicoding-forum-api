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
  pgm.createTable('comment_likes', {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      referencesConstraintName: 'comment_likes_user_id_fkey',
      references: 'users(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      referencesConstraintName: 'comment_likes_comment_id_fkey',
      references: 'comments(id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint(
    'comment_likes',
    'comment_likes_comment_id_user_id_key',
    'UNIQUE(comment_id, user_id)'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'comment_likes_comment_id_user_id_key');
  pgm.dropTable('comment_likes');
};
