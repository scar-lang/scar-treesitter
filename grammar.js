module.exports = grammar({
    name: 'scar',


    extras: $ => [
        /\s/,
        $.line_comment,
        $.doc_comment,
    ],

    conflicts: $ => [
        [$._expression, $.struct_literal], 
        [$.union_type, $.binary_expression],
    ],

    rules: {
        source_file: $ => repeat($._top_level),

        _top_level: $ => choice(
            $.function_def,
            $.type_def,
            $.interface_def,
            $.typeset_def,
            $.extern_def,
            $.test_block,
            $.val_statement,
            $.var_statement,
        ),

        doc_comment: $ => token(seq('##', /.*/)),
        line_comment: $ => token(seq('#', /[^#].*/)),
        function_def: $ => seq(
            optional('pub'),
            'def',
            field('name', $.function_name),
            optional($.generic_params),
            $.param_list,
            optional(field('return_type', $._type)),
            field('body', $.block),
        ),

        function_name: $ => choice(
            seq(field('type', $.identifier), '.', field('method', $.identifier)),
            $.identifier,
        ),

        type_def: $ => seq(
            optional('pub'),
            'type',
            field('name', $.identifier),
            optional(seq(':', field('implements', $.identifier))),
            repeat($.field_decl),
            'end',
        ),

        interface_def: $ => seq(
            optional('pub'),
            'interface',
            field('name', $.identifier),
            repeat($.interface_method),
            'end',
        ),

        interface_method: $ => seq(
            optional('pub'),
            'def',
            field('name', $.identifier),
            $.param_list,
            optional(field('return_type', $._type)),
        ),

        typeset_def: $ => seq(
            optional('pub'),
            'typeset',
            field('name', $.identifier),
            repeat(seq($._primitive_type, optional(','))),
            'end',
        ),

        extern_def: $ => choice(
            seq('extern', 'type', field('name', $.identifier),
                repeat($.field_decl), 'end'),
            seq('extern', 'def', field('name', $.identifier),
                $.param_list, optional($._type),
                '::', field('link_name', $.string)),
        ),

        test_block: $ => seq(
            'test',
            field('name', $.string),
            field('body', $.block),
        ),

        field_decl: $ => seq(
            field('name', $.identifier),
            field('type', $._type),
        ),

        param_list: $ => seq(
            '(',
            optional(seq(
                $.param,
                repeat(seq(',', $.param)),
                optional(','),
            )),
            ')',
        ),

        param: $ => seq(
            field('name', $.identifier),
            field('type', $._type),
        ),

        generic_params: $ => seq(
            '[',
            $.generic_param,
            repeat(seq(',', $.generic_param)),
            ']',
        ),

        generic_param: $ => seq(
            field('name', $.identifier),
            optional(seq(':', field('constraint', $.identifier))),
        ),

        _type: $ => choice(
            $._primitive_type,
            $.ref_type,
            $.mut_type,
            $.fn_type,
            $.array_type,
            $.list_type,
            $.union_type,
            $.named_type,
        ),

        _primitive_type: $ => choice(
            'i8', 'i16', 'i32', 'i64',
            'u8', 'u16', 'u32', 'u64',
            'usize', 'isize',
            'f32', 'f64',
            'bool', 'void', 'str',
        ),

        ref_type: $ => seq('ref', '(', $._type, ')'),
        mut_type: $ => seq('mut', '(', $._type, ')'),
        list_type: $ => seq('list', '[', $._type, ']'),
        array_type: $ => seq('[', $.integer_literal, ']', $._type),

        fn_type: $ => seq(
            '(', 'fn', '(',
            optional(seq($._type, repeat(seq(',', $._type)))),
            ')', $._type, ')',
        ),

        union_type: $ => seq($._type, '|', $._type),

        named_type: $ => $.identifier,

        block: $ => seq(repeat($._statement), 'end'),

        _statement: $ => choice(
            $.var_statement,
            $.val_statement,
            $.return_statement,
            $.if_statement,
            $.for_statement,
            $.match_statement,
            $.guard_statement,
            $.continue_statement,
            $.break_statement,
            $.assert_statement,
            $.expression_statement,
        ),

        var_statement: $ => seq(
            'var', field('name', $.identifier),
            optional(field('type', $._type)),
            optional(seq('=', field('value', $._expression))),
        ),

        val_statement: $ => seq(
            'val', field('name', $.identifier),
            optional(field('type', $._type)),
            '=', field('value', $._expression),
        ),

        return_statement: $ => prec.right(1, seq('return', optional($._expression))),

        continue_statement: $ => 'continue',
        break_statement: $ => 'break',

        assert_statement: $ => seq('assert', $._expression),

        guard_statement: $ => seq(
            'guard', $._expression, 'else',
            repeat($._statement),
            'end',
        ),

        if_statement: $ => seq(
            'if', field('condition', $._expression),
            field('consequence', repeat($._statement)),
            optional(seq('else', repeat($._statement))),
            'end',
        ),

        for_statement: $ => choice(
            prec(3, seq('for', 'var', field('name', $.identifier), '=',
                field('from', $._expression), '..', field('to', $._expression),
                field('body', $.block))),
            prec(2, seq('for', field('condition', $._expression), field('body', $.block))),
            prec(1, seq('for', field('body', $.block))),
        ),
        match_statement: $ => seq(
            'match', field('value', $._expression),
            repeat($.match_arm),
            'end',
        ),

        match_arm: $ => seq(
            choice('ok', 'error'),
            field('binding', $.identifier), '=>',
            choice(
                seq('(', repeat($._statement), ')'),
                $._statement,
            ),
        ),

        expression_statement: $ => seq($._expression),

        _expression: $ => choice(
            $.binary_expression,
            $.unary_expression,
            $.cast_expression,
            $.unwrap_expression,
            $.call_expression,
            $.method_call_expression,
            $.index_expression,
            $.field_expression,
            $.intrinsic_call,
            $.identifier,
            $.integer_literal,
            $.float_literal,
            $.string,
            $.bool_literal,
            $.none_literal,
            $.array_literal,
            $.struct_literal,
            $.fn_value,
            seq('(', $._expression, ')'),
        ),

        binary_expression: $ => choice(
            prec.left(1, seq($._expression, '||', $._expression)),
            prec.left(2, seq($._expression, '&&', $._expression)),
            prec.left(3, seq($._expression, choice('==', '!=', '<', '>', '<=', '>='), $._expression)),
            prec.left(4, seq($._expression, '|', $._expression)),
            prec.left(5, seq($._expression, '^', $._expression)),
            prec.left(6, seq($._expression, '&', $._expression)),
            prec.left(7, seq($._expression, choice('<<', '>>'), $._expression)),
            prec.left(8, seq($._expression, choice('+', '-'), $._expression)),
            prec.left(9, seq($._expression, choice('*', '/', '%'), $._expression)),
            prec.right(10, seq($._expression, '=', $._expression)),
            prec.right(10, seq($._expression, choice('+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='), $._expression)),
        ),

        unary_expression: $ => prec(11, choice(
            seq('-', $._expression),
            seq('!', $._expression),
            seq('~', $._expression),
        )),

        cast_expression: $ => prec.left(12, seq($._expression, 'as', $._type)),
        unwrap_expression: $ => prec(13, seq($._expression, '?')),

        call_expression: $ => prec(14, seq(
            field('function', $.identifier),
            optional($.generic_args),
            '(',
            optional(seq($._expression, repeat(seq(',', $._expression)))),
            ')',
        )),

        method_call_expression: $ => prec(14, seq(
            field('object', $._expression),
            '.',
            field('method', $.identifier),
            optional($.generic_args),
            '(',
            optional(seq($._expression, repeat(seq(',', $._expression)))),
            ')',
        )),

        generic_args: $ => seq(
            '[',
            choice('_', $._type),
            repeat(seq(',', choice('_', $._type))),
            ']',
        ),

        index_expression: $ => prec(14, seq(
            $._expression, '[', $._expression, ']',
        )),

        field_expression: $ => prec(13, seq(
            $._expression, '.', $.identifier,
        )),

        intrinsic_call: $ => seq(
            $.intrinsic,
            '(',
            optional(seq($._expression, repeat(seq(',', $._expression)))),
            ')',
        ),

        intrinsic: $ => /@[a-zA-Z_][a-zA-Z0-9_]*/,

        struct_literal: $ => seq(
            $.identifier,
            '(',
            optional(seq(
                $.struct_field_init,
                repeat(seq(',', $.struct_field_init)),
                optional(','),
            )),
            ')',
        ),

        struct_field_init: $ => seq(
            field('name', $.identifier), ':', field('value', $._expression),
        ),

        array_literal: $ => seq(
            '[',
            optional(seq($._expression, repeat(seq(',', $._expression)), optional(','))),
            ']',
        ),

        fn_value: $ => seq(
            $.identifier,
        ),

        integer_literal: $ => token(choice(
            /[0-9][0-9_]*/,
            /0x[0-9A-Fa-f][0-9A-Fa-f_]*/,
            /0b[01][01_]*/,
            /0o[0-7][0-7_]*/,
        )),

        float_literal: $ => token(
            /[0-9][0-9_]*\.[0-9][0-9_]*([eE][+-]?[0-9]+)?/
        ),

        string: $ => seq(
            '"',
            repeat(choice(
                $.escape_sequence,
                $.format_specifier,
                /[^"\\{]+/,
            )),
            '"',
        ),

        escape_sequence: $ => /\\(x[0-9A-Fa-f]{2}|n|t|r|\\|")/,
        format_specifier: $ => /\{[a-z]+\}/,

        bool_literal: $ => choice('true', 'false'),
        none_literal: $ => 'none',

        identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,
    },
});