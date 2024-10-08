import * as React from "react";
import { toGroupResources, expandResources } from "./utilsJava.js";
import { EMPTY_RESOURCE} from "../../constants/index.mjs";
import { SchedulerResourceIteratorContext } from "../../context/SchedulerResourceIteratorContext.mjs";

export const HorizontalResourceIterator = (props) => {
  const { nested, children, rowContentProps } = props;
  const rowContent = props.rowContent || DefaultRowContent;
  const childRowContent = props.childRowContent || rowContent;
  const hideDateRow = props.hideDateRow || false;
  
  const resources = React.useMemo(() => toGroupResources(props.group, props.resources), [props.group, props.resources]);
  
  const groupIndex = 0;
  return (
      <div className="k-scheduler-group k-group-horizontal">
        {nested
            ? renderResourcesRecursively({ resources, children, nested, groupIndex, rowContent, rowContentProps, childRowContent, hideDateRow })
            : renderResources({ resources, children, rowContent, nested: !!nested, groupIndex, rowContentProps, childRowContent, hideDateRow })}
      </div>
  );
};

const renderResourcesRecursively = (args) => {
  const { resources, rowContent, nested, children, groupIndex, rowContentProps, childRowContent, hideDateRow } = args;

  if (hideDateRow && groupIndex === resources.length){
    return (<></>);
  }
  
  if (groupIndex === resources.length) {
    return renderResources({ resources, rowContent, children, nested, groupIndex, rowContentProps, childRowContent });
  }

  const expandedResources = expandResources(resources, groupIndex);
  const RowContent = rowContent;
  
  return (
      <React.Fragment>
        {nested
            ? (<div className="k-scheduler-row">
                  <RowContent resources={resources} groupIndex={groupIndex} {...rowContentProps}>
                    {expandedResources.map((expandedResource, expandedResourceIndex) => (
                        <div
                            key={expandedResourceIndex}
                            className="k-scheduler-cell k-heading-cell k-header-resource"
                            dangerouslySetInnerHTML={{__html: expandedResource.text}}
                        ></div>
            ))}
      </RowContent>
</div>)
:
  (<RowContent resources={resources} groupIndex={groupIndex} {...rowContentProps}>
    {expandedResources.map((expandedResource, expandedResourceIndex) => (
                  <div key={expandedResourceIndex} className="k-scheduler-cell k-heading-cell">
                    {expandedResource.text}
                  </div>))}
            </RowContent>)
        }
        {renderResourcesRecursively({
          resources,
          children,
          nested,
          rowContent,
          childRowContent,
          hideDateRow,
          groupIndex: groupIndex + 1
        })}
      </React.Fragment>
  );
};

const renderResources = (args) => {
  const { resources, childRowContent, children, rowContentProps, hideDateRow } = args;

  const deepestResources = expandResources(resources, resources.length - 1);
  const ChildRowContent = childRowContent;

  const hasGroups = resources.length > 0;
  
  return (
      <div className="k-scheduler-row k-date-row-header">
        <ChildRowContent resources={resources}  {...rowContentProps}>
          {(deepestResources.length ? deepestResources : EMPTY_RESOURCE).map((resource, groupIndex) => (
              <div key={groupIndex} className="k-scheduler-cell k-group-cell">
                <SchedulerResourceIteratorContext.Provider value={{ resource, groupIndex: hasGroups ? groupIndex : 0 }}>
                  {children}
                </SchedulerResourceIteratorContext.Provider>
              </div>
          ))}
        </ChildRowContent>
      </div>
  );
};

HorizontalResourceIterator.displayName = 'KendoReactSchedulerHorizontalResourceIterator';
export const DefaultRowContent = (props) => props.children;
