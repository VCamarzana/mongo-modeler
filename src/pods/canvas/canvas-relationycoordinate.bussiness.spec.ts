import { GUID } from '@/core/model';

import { TableVm, YRelationCoords } from './canvas.vm';
import {
  HEADER_HEIGHT,
  ROW_HEIGHT,
} from './components/table/database-table.const';
import {
  calculateRelationYCoordinate,
  calculateRelationYOffset,
} from './canvas.business';

describe('canvas.business.calculateRelationYOffset', () => {
  it('should return the correct Y-coordinate for the field when found on the first level', () => {
    // Arrange
    const fieldId: GUID = '1';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'string',
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const expectedYPosition = table.y + HEADER_HEIGHT + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toEqual(expectedYPosition);
  });

  it('should return the correct Y-coordinate if field is found on first level, second field', () => {
    // Arrange
    const fieldId: GUID = '2';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'string',
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const headerOffset = table.y + HEADER_HEIGHT;

    const expectedYPosition = headerOffset + ROW_HEIGHT + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toEqual(expectedYPosition);
  });

  it(`should return the correct Y-coordinate if field is found on second level,parent field not collapsed, child field first one
  +-------------------------------------------------------+
  | table1                                                |
  | ======================================================|
  | id: 1                                                 |
  | fields:                                               |
  |   field1                        id: 1   type: string  |
  |   ▼ field2                      id: 2   type: object  |
  |       field3                    id: 3   type: string  |
  +-------------------------------------------------------+

  `, () => {
    // Arrange
    const fieldId: GUID = '3';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          children: [
            {
              id: '3',
              name: 'field3',
              type: 'string',
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const headerOffset = table.y + HEADER_HEIGHT;

    const expectedYPosition = headerOffset + ROW_HEIGHT * 2 + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toBe(expectedYPosition);
  });

  it(`should return the correct Y-coordinate if field is found on second level,parent field not collapsed, child field first one, and table origin !== (0, 0)
  +-------------------------------------------------------+
  | table1                                                |
  | ======================================================|
  | id: 1                                                 |
  | fields:                                               |
  |   field1                        id: 1   type: string  |
  |   ▼ field2                      id: 2   type: object  |
  |       field3                    id: 3   type: string  |
  +-------------------------------------------------------+

  `, () => {
    // Arrange
    const fieldId: GUID = '3';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          children: [
            {
              id: '3',
              name: 'field3',
              type: 'string',
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 100,
      y: 200,
    };

    const headerOffset = table.y + HEADER_HEIGHT;

    const expectedYPosition = headerOffset + ROW_HEIGHT * 2 + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toBe(expectedYPosition);
  });

  it(`should return the correct Y-coordinate searching for field3 but collapsed
  +-------------------------------------------------------+
  | table1                                                |
  | ======================================================|
  | id: 1                                                 |
  | fields:                                               |
  |   field1                        id: 1   type: string  |
  |   ▶ field2                      id: 2   type: object  |
  |       [No Visible] field3       id: 3   type: string  |
  +-------------------------------------------------------+

  `, () => {
    // Arrange
    const fieldId: GUID = '3';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          isCollapsed: true,
          children: [
            {
              id: '3',
              name: 'field3',
              type: 'string',
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const headerOffset = table.y + HEADER_HEIGHT;

    const expectedYPosition = headerOffset + ROW_HEIGHT * 2 + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toEqual(expectedYPosition);
  });

  it(`should return the correct Y-coordinate if field is found on third level, parent field not collapsed, child field collapsed
  +-------------------------------------------------------+
  | table1                                                |
  | ======================================================|
  | id: 1                                                 |
  | fields:                                               |
  |   field1                        id: 1   type: string  |
  |   ▼ field2                      id: 2   type: object  |
  |       childField1               id: 4   type: number  |
  |       childField2               id: 5   type: number  |
  |       ▶ collapsibleField        id: 6   type: object  |
  |           [Not Visible] subField1 id: 7 type: number  |
  |           [Not Visible] subField2 id: 8 type: number  |
  +-------------------------------------------------------+  
  `, () => {
    // Arrange
    const fieldId: GUID = '8';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          isCollapsed: false,
          children: [
            {
              id: '4',
              name: 'childField1',
              type: 'number',
            },
            {
              id: '5',
              name: 'childField2',
              type: 'number',
            },
            {
              id: '6',
              name: 'collapsibleField',
              type: 'object',
              isCollapsed: true,
              children: [
                {
                  id: '7',
                  name: 'subField1',
                  type: 'number',
                },
                {
                  id: '8',
                  name: 'subField2',
                  type: 'number',
                },
              ],
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const headerOffset = table.y + HEADER_HEIGHT;
    const expectedYPosition = headerOffset + ROW_HEIGHT * 5 + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toEqual(expectedYPosition);
  });
  it(`should return the correct Y-coordinate if field is found on third level, parent field not collapsed, child field collapsed
  +-------------------------------------------------------+
  | table1                                                |
  | ======================================================|
  | id: 1                                                 |
  | fields:                                               |
  |   field1                        id: 1   type: string  |
  |   ▼ field2                      id: 2   type: object  |
  |       childField1               id: 4   type: number  |
  |       ▶ collapsibleField        id: 5   type: object  |
  |           [Not Visible] subField1 id: 7 type: number  |
  |           [Not Visible] subField2 id: 8 type: nnumber |
  |       ▶ collapsibleField        id: 6   type: object  |
  |           [Not Visible] subField1 id: 9 type: number  |
  |           [Not Visible] subField2 id: 10 type: number |
  +-------------------------------------------------------+  
  `, () => {
    // Arrange
    const fieldId: GUID = '9';
    const table: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          isCollapsed: false,
          children: [
            {
              id: '4',
              name: 'childField1',
              type: 'number',
            },
            {
              id: '5',
              name: 'collapsibleField1',
              type: 'object',
              isCollapsed: true,
              children: [
                {
                  id: '7',
                  name: 'subField1',
                  type: 'number',
                },
                {
                  id: '8',
                  name: 'subField2',
                  type: 'number',
                },
              ],
            },
            {
              id: '6',
              name: 'collapsibleField2',
              type: 'object',
              isCollapsed: true,
              children: [
                {
                  id: '9',
                  name: 'subField1',
                  type: 'number',
                },
                {
                  id: '10',
                  name: 'subField2',
                  type: 'number',
                },
              ],
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };

    const headerOffset = table.y + HEADER_HEIGHT;
    const expectedYPosition = headerOffset + ROW_HEIGHT * 5 + ROW_HEIGHT / 2;

    // Act
    const result = calculateRelationYOffset(fieldId, table);

    // Assert
    expect(result).toEqual(expectedYPosition);
  });
});

describe(calculateRelationYCoordinate, () => {
  it(`should return the correct Y-coordinate relation for two tables`, () => {
    // Arrange
    const fieldIdOrigin: GUID = '3';
    const tableOrigin: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          children: [
            {
              id: '3',
              name: 'field3',
              type: 'string',
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 0,
      y: 0,
    };
    const fieldIdDestination: GUID = '2';
    const tableDestination: TableVm = {
      id: '1',
      fields: [
        {
          id: '1',
          name: 'field1',
          type: 'string',
        },
        {
          id: '2',
          name: 'field2',
          type: 'object',
          children: [
            {
              id: '3',
              name: 'field3',
              type: 'string',
            },
          ],
        },
      ],
      tableName: 'table1',
      x: 200,
      y: 200,
    };

    const headerOffsetOrigin = tableOrigin.y + HEADER_HEIGHT;
    const headerOffsetDestination = tableDestination.y + HEADER_HEIGHT;

    const expectedYPositionOrigin =
      headerOffsetOrigin + ROW_HEIGHT * 2 + ROW_HEIGHT / 2;
    const expectedYPositionDestination =
      headerOffsetDestination + ROW_HEIGHT + ROW_HEIGHT / 2;

    const expectedYRelationCoords: YRelationCoords = {
      yOrigin: expectedYPositionOrigin,
      yDestination: expectedYPositionDestination,
    };

    // Act
    const result = calculateRelationYCoordinate(
      fieldIdOrigin,
      fieldIdDestination,
      tableOrigin,
      tableDestination
    );

    // Assert
    expect(result).toEqual(expectedYRelationCoords);
  });
});
